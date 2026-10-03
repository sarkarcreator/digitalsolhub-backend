<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentLearningAttempt;
use App\Models\StudentLearningState;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StudentLearningController extends Controller
{
    private const TYPING_PASSAGE = 'Microsoft Word is a powerful document creation tool. Practice typing carefully, keep your hands positioned correctly, and focus on accuracy before speed. Professional office work requires clear documents, consistent formatting, and confident keyboard skills.';
    private const TYPING_MIN_WPM = 20;
    private const TYPING_MIN_ACCURACY = 85;
    private const TEST_PASSING_SCORE = 70;

    public function officeManagement(Request $request)
    {
        $state = $this->state($request);
        $chapters = $this->chapters();

        return response()->json([
            'course' => ['id'=>$state->course_id,'name'=>$state->course_name,'type'=>'office-management'],
            'requirements' => ['typingMinWpm'=>self::TYPING_MIN_WPM,'typingMinAccuracy'=>self::TYPING_MIN_ACCURACY,'dailyLessonLimit'=>3,'chapterCount'=>12,'lessonsPerChapter'=>3],
            'typing' => ['passed'=>(bool)$state->typing_passed,'wpm'=>$state->typing_wpm,'accuracy'=>$state->typing_accuracy,'passage'=>self::TYPING_PASSAGE],
            'word' => [
                'chapters'=>array_map(fn($c)=>[
                    'number'=>$c['number'],'title'=>$c['title'],
                    'lessons'=>array_map(fn($l)=>['id'=>$l['id'],'number'=>$l['number'],'title'=>$l['title']],$c['lessons']),
                    'unlocked'=>$this->chapterUnlocked($state,$c['number']),
                    'passed'=>$this->chapterPassed($state,$c['number']),
                ],$chapters),
                'finalPassed'=>(bool)$state->word_final_passed,
            ],
            'excelUnlocked'=>(bool)$state->excel_unlocked,
            'dailyLessonsCompleted'=>$this->dailyLessonCount($state),
            'state'=>$this->statePayload($state),
            'progress'=>$this->progress($state),
        ]);
    }

    public function chapterTest(Request $request, int $chapter)
    {
        $state=$this->state($request);
        abort_unless($state->typing_passed,403,'Pass the typing test first.');
        abort_unless($chapter>=1 && $chapter<=12,404,'Chapter not found.');
        abort_unless($this->chapterUnlocked($state,$chapter),403,'This chapter is locked.');
        $data=$this->chapters()[$chapter-1];
        abort_unless($this->chapterLessonsComplete($state,$chapter),403,'Complete all 3 lessons before taking the chapter test.');
        return response()->json(['chapter'=>$chapter,'title'=>$data['title'],'questions'=>$this->publicQuestions($data['questions']),'passingScore'=>self::TEST_PASSING_SCORE]);
    }

    public function finalTest(Request $request)
    {
        $state=$this->state($request);
        abort_unless(count($state->passed_chapters??[])===12,403,'Complete and pass all 12 Word chapter tests first.');
        return response()->json(['questions'=>$this->publicQuestions($this->finalQuestions()),'passingScore'=>self::TEST_PASSING_SCORE]);
    }

    public function submitTyping(Request $request)
    {
        $data=$request->validate(['courseId'=>'required|string|max:120','courseName'=>'required|string|max:255','typedText'=>'required|string','elapsedSeconds'=>'required|numeric|min:5|max:3600']);
        abort_unless($this->isOfficeManagement($data['courseId'],$data['courseName']),422,'This learning path is only available for Office Management.');
        $typed=preg_replace('/\s+/',' ',trim($data['typedText'])) ?: '';
        $target=self::TYPING_PASSAGE;
        $typedChars=mb_strlen($typed); $targetChars=mb_strlen($target); $matches=0;
        for($i=0;$i<min($typedChars,$targetChars);$i++) if(mb_substr($typed,$i,1)===mb_substr($target,$i,1)) $matches++;
        $accuracy=$typedChars?round(($matches/$typedChars)*100,2):0;
        $wpm=round(str_word_count($typed)/((float)$data['elapsedSeconds']/60),2);
        $passed=$wpm>=self::TYPING_MIN_WPM && $accuracy>=self::TYPING_MIN_ACCURACY && $typedChars>=max(40,(int)floor($targetChars*.7));
        $state=$this->state($request,$data['courseId'],$data['courseName']);
        $state->typing_passed=$state->typing_passed || $passed; $state->typing_wpm=$wpm; $state->typing_accuracy=$accuracy; $state->save();
        StudentLearningAttempt::create(['user_id'=>$request->user()->id,'course_id'=>$data['courseId'],'stage'=>'typing','score'=>$accuracy,'passed'=>$passed,'metadata'=>['wpm'=>$wpm,'accuracy'=>$accuracy,'elapsedSeconds'=>(float)$data['elapsedSeconds']]]);
        return response()->json(['passed'=>$passed,'wpm'=>$wpm,'accuracy'=>$accuracy,'requiredWpm'=>self::TYPING_MIN_WPM,'requiredAccuracy'=>self::TYPING_MIN_ACCURACY,'message'=>$passed?'Typing test passed. Microsoft Word is now unlocked.':'Typing test not passed. Please try again.']);
    }

    public function completeLesson(Request $request,int $lesson)
    {
        $data=$request->validate(['courseId'=>'required|string|max:120','courseName'=>'required|string|max:255']);
        abort_unless($this->isOfficeManagement($data['courseId'],$data['courseName']),422,'This learning path is only available for Office Management.');
        $state=$this->state($request,$data['courseId'],$data['courseName']);
        abort_unless($state->typing_passed,403,'Pass the typing test before starting Microsoft Word.');
        abort_unless($lesson>=1 && $lesson<=36,404,'Lesson not found.');
        abort_unless($this->lessonUnlocked($state,$lesson),403,'Complete the previous lesson or chapter test first.');
        $completed=$state->completed_lessons??[];
        if(in_array($lesson,$completed,true)) return response()->json(['message'=>'Lesson already completed.','state'=>$this->statePayload($state)]);
        if($this->dailyLessonCount($state)>=3) abort(429,'Daily limit reached. You can continue with the next lesson tomorrow.');
        $completed[]=$lesson; $state->completed_lessons=array_values(array_unique(array_map('intval',$completed)));
        $state->last_lesson_completed_at=now(); $state->daily_lessons_completed=$this->dailyLessonCount($state)+1; $state->daily_lessons_date=now()->toDateString(); $state->current_lesson=$lesson; $state->save();
        return response()->json(['message'=>'Lesson completed.','state'=>$this->statePayload($state)]);
    }

    public function submitChapterTest(Request $request,int $chapter)
    {
        $data=$request->validate(['courseId'=>'required|string|max:120','courseName'=>'required|string|max:255','answers'=>'required|array|min:1']);
        $state=$this->state($request,$data['courseId'],$data['courseName']);
        abort_unless($state->typing_passed,403,'Pass the typing test first.');
        abort_unless($chapter>=1 && $chapter<=12,404,'Chapter not found.');
        abort_unless($this->chapterUnlocked($state,$chapter),403,'This chapter is locked.');
        abort_unless($this->chapterLessonsComplete($state,$chapter),403,'Complete all 3 lessons before taking the chapter test.');
        $questions=$this->chapters()[$chapter-1]['questions']; $score=$this->scoreAnswers($data['answers'],$questions); $passed=$score>=self::TEST_PASSING_SCORE;
        $passedChapters=$state->passed_chapters??[]; if($passed)$passedChapters[]=$chapter; $state->passed_chapters=array_values(array_unique(array_map('intval',$passedChapters))); $state->save();
        StudentLearningAttempt::create(['user_id'=>$request->user()->id,'course_id'=>$data['courseId'],'stage'=>'chapter_test','chapter'=>$chapter,'score'=>$score,'passed'=>$passed,'answers'=>$data['answers']]);
        return response()->json(['passed'=>$passed,'score'=>$score,'passingScore'=>self::TEST_PASSING_SCORE,'message'=>$passed?'Chapter test passed. Next chapter unlocked.':'Chapter test not passed. Please review the lessons and try again.']);
    }

    public function submitWordFinal(Request $request)
    {
        $data=$request->validate(['courseId'=>'required|string|max:120','courseName'=>'required|string|max:255','answers'=>'required|array|min:1']);
        $state=$this->state($request,$data['courseId'],$data['courseName']);
        abort_unless(count($state->passed_chapters??[])===12,403,'Complete and pass all 12 Word chapter tests first.');
        $score=$this->scoreAnswers($data['answers'],$this->finalQuestions()); $passed=$score>=self::TEST_PASSING_SCORE;
        if($passed){$state->word_final_passed=true;$state->word_completed=true;$state->excel_unlocked=true;$state->save();}
        StudentLearningAttempt::create(['user_id'=>$request->user()->id,'course_id'=>$data['courseId'],'stage'=>'word_final','score'=>$score,'passed'=>$passed,'answers'=>$data['answers']]);
        return response()->json(['passed'=>$passed,'score'=>$score,'passingScore'=>self::TEST_PASSING_SCORE,'excelUnlocked'=>$state->excel_unlocked,'message'=>$passed?'Word completed. Excel is now unlocked.':'Final test not passed. Please try again.']);
    }

    private function state(Request $request,?string $courseId=null,?string $courseName=null):StudentLearningState
    {
        $courseId=$courseId?:$request->query('courseId'); $courseName=$courseName?:$request->query('courseName','Office Management');
        abort_unless($courseId,422,'Course ID is required.');
        return StudentLearningState::firstOrCreate(['user_id'=>$request->user()->id,'course_id'=>$courseId],['course_name'=>$courseName]);
    }

    private function isOfficeManagement(string $id,string $name):bool{return Str::contains(Str::lower($id),'office-management')||Str::contains(Str::lower($name),'office management');}
    private function dailyLessonCount(StudentLearningState $s):int{return $s->daily_lessons_date&&$s->daily_lessons_date->isToday()?(int)$s->daily_lessons_completed:0;}
    private function statePayload(StudentLearningState $s):array{return ['typingPassed'=>$s->typing_passed,'completedLessons'=>$s->completed_lessons??[],'passedChapters'=>$s->passed_chapters??[],'wordFinalPassed'=>$s->word_final_passed,'excelUnlocked'=>$s->excel_unlocked,'dailyLessonsCompleted'=>$this->dailyLessonCount($s)];}
    private function lessonUnlocked(StudentLearningState $s,int $lesson):bool{if($lesson===1)return true;if($lesson%3!==1)return in_array($lesson-1,$s->completed_lessons??[],true);return in_array((int)floor(($lesson-1)/3),$s->passed_chapters??[],true);}
    private function chapterLessonsComplete(StudentLearningState $s,int $chapter):bool{$base=(($chapter-1)*3)+1;return collect([$base,$base+1,$base+2])->every(fn($id)=>in_array($id,$s->completed_lessons??[],true));}
    private function chapterPassed(StudentLearningState $s,int $chapter):bool{return in_array($chapter,$s->passed_chapters??[],true);}
    private function chapterUnlocked(StudentLearningState $s,int $chapter):bool{return $s->typing_passed&&($chapter===1||$this->chapterPassed($s,$chapter-1));}
    private function publicQuestions(array $questions):array{return array_map(fn($q)=>['q'=>$q['q'],'options'=>$q['options']],$questions);}
    private function scoreAnswers(array $answers,array $questions):float{$correct=0;foreach($questions as $i=>$q)if((string)($answers[$i]??'')===(string)$q['answer'])$correct++;return count($questions)?round($correct/count($questions)*100,2):0;}
    private function finalQuestions():array{return [
        ['q'=>'Which shortcut saves a Word document?','options'=>['Ctrl+S','Ctrl+P','Ctrl+N','Ctrl+F'],'answer'=>'Ctrl+S'],
        ['q'=>'Which feature applies consistent formatting to headings?','options'=>['Styles','Zoom','Comments','Print'],'answer'=>'Styles'],
        ['q'=>'Which tab contains page margins?','options'=>['Layout','Review','View','Mailings'],'answer'=>'Layout'],
        ['q'=>'What is the purpose of spell check?','options'=>['Find spelling errors','Insert pictures','Change margins','Create charts'],'answer'=>'Find spelling errors'],
        ['q'=>'Which shortcut makes selected text bold?','options'=>['Ctrl+B','Ctrl+I','Ctrl+U','Ctrl+L'],'answer'=>'Ctrl+B'],
    ];}
    private function chapters():array
    {
        $topics=[
            ['Getting Started',['Open Word & Interface','Create, Save & Open Documents','Basic Navigation']],
            ['Text & Editing',['Enter & Select Text','Cut, Copy & Paste','Find & Replace']],
            ['Formatting',['Fonts & Text Formatting','Paragraph Formatting','Styles & Themes']],
            ['Page Layout',['Margins & Orientation','Size, Columns & Breaks','Headers & Footers']],
            ['Lists & Organization',['Bullets & Numbering','Multilevel Lists','Tabs & Indentation']],
            ['Tables',['Create Tables','Format Table Data','Sort & Adjust Tables']],
            ['Images & Graphics',['Insert Pictures','Wrap Text & Positioning','Shapes & Icons']],
            ['References',['Footnotes & Endnotes','Citations Basics','Table of Contents']],
            ['Review & Collaboration',['Spelling & Grammar','Comments & Track Changes','Document Inspection']],
            ['Professional Documents',['Letters & Applications','Reports & Business Documents','Templates']],
            ['Advanced Word Skills',['Sections & Advanced Layout','Fields & Document Controls','Accessibility & Best Practices']],
            ['Final Office Workflow',['Document Cleanup','Print & Export PDF','Professional Word Project']],
        ];
        return array_map(function($x,$idx){$n=$idx+1;$lessons=[];foreach($x[1] as $j=>$title)$lessons[]=['id'=>($n-1)*3+$j+1,'number'=>$j+1,'title'=>$title];$qs=[
            ['q'=>"Which lesson belongs to Chapter {$n}: {$x[0]}?",'options'=>[$x[1][0],$x[1][1],'Email marketing','Graphic design'],'answer'=>$x[1][0]],
            ['q'=>"Which second skill is taught in Chapter {$n}?",'options'=>[$x[1][1],$x[1][0],'Video editing','Accounting'],'answer'=>$x[1][1]],
            ['q'=>"What is the third lesson of Chapter {$n}?",'options'=>[$x[1][2],$x[1][0],'Social media','Web hosting'],'answer'=>$x[1][2]],
        ];return ['number'=>$n,'title'=>$x[0],'lessons'=>$lessons,'questions'=>$qs];},$topics,array_keys($topics));
    }
    private function progress(StudentLearningState $s):array{$lessons=count($s->completed_lessons??[]);$chapters=count($s->passed_chapters??[]);return ['lessonsCompleted'=>$lessons,'totalLessons'=>36,'chaptersPassed'=>$chapters,'totalChapters'=>12,'percentage'=>round(($lessons/36)*80+($chapters/12)*20,2)];}
}
