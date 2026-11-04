<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class StudentExcelLearningController extends Controller
{
    private const PASS = 70;

    private function topics(): array
    {
        return [
            ['Excel Introduction & Interface', ['Excel kya hai aur kahan use hota hai','Excel Window, Ribbon aur Workbook','Rows, Columns, Cells aur Cell Address']],
            ['Workbook, Worksheets & Data Entry', ['New Workbook banana aur save karna','Worksheet add, rename, move aur delete karna','Data enter, edit aur AutoFill use karna']],
            ['Rows, Columns, Cells & Formatting', ['Rows aur Columns insert, delete aur resize','Number, Date aur Text Formatting','Borders, Alignment, Wrap Text aur Merge']],
            ['Basic Formulas & Operators', ['Formula ka structure aur cell references','Addition, Subtraction, Multiplication aur Division','Relative, Absolute aur Mixed References']],
            ['Essential Functions', ['SUM, AVERAGE aur AutoSum','MIN, MAX, COUNT aur COUNTA','Percentage aur basic business calculations']],
            ['Logical Functions', ['IF Function with practical examples','AND aur OR functions','Nested IF aur IFERROR ka introduction']],
            ['Lookup Functions', ['VLOOKUP syntax aur exact match','HLOOKUP aur lookup table practice','XLOOKUP aur modern lookup approach']],
            ['Sorting, Filtering & Data Validation', ['Sort data A-Z, Z-A aur custom sort','Filter records aur search criteria','Data Validation aur drop-down lists']],
            ['Tables & Conditional Formatting', ['Excel Table create aur design karna','Conditional Formatting rules','Duplicate values aur Remove Duplicates']],
            ['Charts & Data Visualization', ['Column, Bar, Line aur Pie Charts','Chart title, legend, labels aur formatting','Dashboard-style charts aur data story']],
            ['Pivot Tables, Printing & Page Setup', ['Pivot Table create aur summarize karna','Pivot fields, filters aur grouping','Print Area, Page Layout aur PDF export']],
            ['Practical Office Projects & Final Revision', ['Student marksheet with grades','Monthly expense aur sales report','Complete Excel project and final revision']],
        ];
    }

    private function state(Request $request, ?string $courseId = null): object
    {
        $courseId = $courseId ?: $request->query('courseId');
        abort_unless($courseId, 422, 'Course ID is required.');
        $state = DB::table('student_learning_states')->where('user_id', $request->user()->id)->where('course_id', $courseId)->first();
        abort_unless($state, 404, 'Complete the typing qualification and Word learning path first.');
        abort_unless((bool) $state->excel_unlocked, 403, 'Pass the Word final test to unlock Excel.');
        return $state;
    }

    private function arr($value): array
    {
        if (is_array($value)) return $value;
        $decoded = json_decode((string) $value, true);
        return is_array($decoded) ? array_map('intval', $decoded) : [];
    }

    private function dailyCount(object $state): int
    {
        return $state->daily_lessons_date && substr((string) $state->daily_lessons_date, 0, 10) === now()->toDateString()
            ? (int) $state->daily_lessons_completed : 0;
    }

    private function chapterPassed(object $state, int $chapter): bool
    {
        return in_array($chapter, $this->arr($state->excel_passed_chapters), true);
    }

    private function lessonUnlocked(object $state, int $lesson): bool
    {
        if ($lesson === 1) return true;
        if ($lesson % 3 !== 1) return in_array($lesson - 1, $this->arr($state->excel_completed_lessons), true);
        return $this->chapterPassed($state, (int) floor(($lesson - 1) / 3));
    }

    private function chapterLessonsComplete(object $state, int $chapter): bool
    {
        $completed = $this->arr($state->excel_completed_lessons);
        $first = (($chapter - 1) * 3) + 1;
        return in_array($first, $completed, true) && in_array($first + 1, $completed, true) && in_array($first + 2, $completed, true);
    }

    private function lessonAnswers(): array
    {
        return [
            1=>'Spreadsheets aur data calculations ke liye',2=>'Ribbon',3=>'Column letter aur row number ka intersection',
            4=>'File > Save As',5=>'Rename',6=>'Fill Handle',7=>'Cell ya range select karna',8=>'Number',9=>'Wrap Text',
            10=>'=',11=>'A1+B1',12=>'Dollar sign ($)',13=>'SUM',14=>'AVERAGE',15=>'COUNT',
            16=>'IF',17=>'AND',18=>'Error ko handle karne ke liye',19=>'VLOOKUP',20=>'Horizontal row mein search',
            21=>'XLOOKUP',22=>'Data tab',23=>'Filter',24=>'Data Validation',25=>'Format as Table',
            26=>'Conditional Formatting',27=>'Duplicate values',28=>'Data ko visual form mein dikhana',
            29=>'Pie Chart',30=>'Chart Title',31=>'Data summarize karna',32=>'PivotTable Fields',
            33=>'Print Area',34=>'SUM',35=>'Monthly expense report',36=>'Formula aur formatting check',
        ];
    }

    private function chapterQuestions(int $chapter): array
    {
        $topic = $this->topics()[$chapter - 1][1];
        return [
            ['q'=>'Chapter '.$chapter.' mein pehla skill kya hai?','options'=>[$topic[0],$topic[1],'Email writing','Video editing'],'answer'=>$topic[0]],
            ['q'=>'Chapter '.$chapter.' mein doosra skill kya hai?','options'=>[$topic[1],$topic[0],'Graphic design','Web hosting'],'answer'=>$topic[1]],
            ['q'=>'Chapter '.$chapter.' mein teesra skill kya hai?','options'=>[$topic[2],$topic[0],'Social media','Networking'],'answer'=>$topic[2]],
        ];
    }

    private function finalQuestions(): array
    {
        return [
            ['q'=>'Excel formula kis symbol se start hota hai?','options'=>['=','+','#','@'],'answer'=>'='],
            ['q'=>'Numbers ka total nikalne ke liye kaunsa function use hota hai?','options'=>['SUM','COUNT','MAX','IF'],'answer'=>'SUM'],
            ['q'=>'VLOOKUP mein exact match ke liye range_lookup kya hota hai?','options'=>['FALSE','TRUE','1','Blank'],'answer'=>'FALSE'],
            ['q'=>'Data ko condition ke mutabiq dikhane ke liye kya use hota hai?','options'=>['Filter','Merge','Wrap Text','Freeze'],'answer'=>'Filter'],
            ['q'=>'Large data summarize karne ke liye kaunsa tool useful hai?','options'=>['PivotTable','WordArt','Page Border','Spell Check'],'answer'=>'PivotTable'],
            ['q'=>'Percentage nikalne ka common formula kya hai?','options'=>['Obtained/Total*100','Total/Obtained','Obtained+Total','Total*100'],'answer'=>'Obtained/Total*100'],
        ];
    }

    private function score(array $answers, array $questions): float
    {
        $correct = 0;
        foreach ($questions as $i => $q) if ((string) ($answers[$i] ?? '') === $q['answer']) $correct++;
        return count($questions) ? round($correct / count($questions) * 100, 2) : 0;
    }

    private function attempt(Request $request, string $courseId, string $stage, ?int $chapter, float $score, bool $passed, array $answers): void
    {
        DB::table('student_learning_attempts')->insert([
            'user_id'=>$request->user()->id,'course_id'=>$courseId,'stage'=>$stage,'chapter'=>$chapter,
            'score'=>$score,'passed'=>$passed,'answers'=>json_encode($answers),'metadata'=>json_encode(['track'=>'excel']),
            'created_at'=>now(),'updated_at'=>now(),
        ]);
    }

    public function dashboard(Request $request)
    {
        $state = $this->state($request);
        $topics = $this->topics();
        $completed = $this->arr($state->excel_completed_lessons);
        $passed = $this->arr($state->excel_passed_chapters);
        $chapters = [];
        foreach ($topics as $i => $topic) {
            $number = $i + 1;
            $chapters[] = ['number'=>$number,'title'=>$topic[0],
                'lessons'=>array_map(fn($title,$j)=>['id'=>$i*3+$j+1,'number'=>$j+1,'title'=>$title],$topic[1],array_keys($topic[1])),
                'unlocked'=>$number===1 || in_array($number-1,$passed,true),'passed'=>in_array($number,$passed,true)];
        }
        return response()->json([
            'unlocked'=>(bool)$state->excel_unlocked,'finalPassed'=>(bool)$state->excel_final_passed,
            'chapters'=>$chapters,'completedLessons'=>$completed,'passedChapters'=>$passed,
            'passedLessons'=>$this->arr($state->excel_passed_lessons),
            'dailyLessonsCompleted'=>$this->dailyCount($state),'dailyLessonLimit'=>3,
            'progress'=>['lessonsCompleted'=>count($completed),'chaptersPassed'=>count($passed),
                'percentage'=>round((count($completed)/36)*80+(count($passed)/12)*20,2)],
        ]);
    }

    public function lessonTest(Request $request, int $lesson)
    {
        $data=$request->validate(['courseId'=>'required|string|max:120','answer'=>'required|string|max:255']);
        $state=$this->state($request,$data['courseId']);
        abort_unless($lesson>=1 && $lesson<=36,404,'Excel lesson not found.');
        abort_unless($this->lessonUnlocked($state,$lesson),403,'Complete the previous Excel lesson or chapter test first.');
        $passed=($this->lessonAnswers()[$lesson]??null)===$data['answer'];
        $passedLessons=$this->arr($state->excel_passed_lessons);
        if($passed && !in_array($lesson,$passedLessons,true)) $passedLessons[]=$lesson;
        if($passed) DB::table('student_learning_states')->where('id',$state->id)->update(['excel_passed_lessons'=>json_encode($passedLessons),'updated_at'=>now()]);
        $this->attempt($request,$data['courseId'],'excel_lesson_test',(int)ceil($lesson/3),$passed?100:0,$passed,[$data['answer']]);
        return response()->json(['passed'=>$passed,'message'=>$passed?'Excel lesson knowledge check passed.':'Jawab durust nahi. Lesson dobara parhein aur try karein.']);
    }

    public function completeLesson(Request $request, int $lesson)
    {
        $data=$request->validate(['courseId'=>'required|string|max:120']);
        $state=$this->state($request,$data['courseId']);
        abort_unless($lesson>=1 && $lesson<=36,404,'Excel lesson not found.');
        abort_unless($this->lessonUnlocked($state,$lesson),403,'Previous Excel lesson or chapter is incomplete.');
        abort_unless(in_array($lesson,$this->arr($state->excel_passed_lessons),true),403,'Pass the Excel lesson knowledge check first.');
        $completed=$this->arr($state->excel_completed_lessons);
        if(in_array($lesson,$completed,true)) return response()->json(['message'=>'Lesson already completed.']);
        if($this->dailyCount($state)>=3) abort(429,'Daily limit reached. Continue tomorrow.');
        $completed[]=$lesson;
        DB::table('student_learning_states')->where('id',$state->id)->update([
            'excel_completed_lessons'=>json_encode($completed),'last_lesson_completed_at'=>now(),
            'daily_lessons_completed'=>$this->dailyCount($state)+1,'daily_lessons_date'=>now()->toDateString(),'updated_at'=>now(),
        ]);
        return response()->json(['message'=>'Excel lesson completed. Progress saved.','completedLessons'=>$completed]);
    }

    public function chapterTest(Request $request, int $chapter)
    {
        $state=$this->state($request);
        abort_unless($chapter>=1 && $chapter<=12,404,'Excel chapter not found.');
        abort_unless($this->chapterPassed($state,$chapter) || ($chapter===1 || $this->chapterPassed($state,$chapter-1)),403,'Excel chapter is locked.');
        abort_unless($this->chapterLessonsComplete($state,$chapter),403,'Complete all 3 Excel lessons first.');
        $questions=$this->chapterQuestions($chapter);
        return response()->json(['chapter'=>$chapter,'title'=>$this->topics()[$chapter-1][0],'questions'=>array_map(fn($q)=>['q'=>$q['q'],'options'=>$q['options']],$questions),'passingScore'=>self::PASS]);
    }

    public function submitChapterTest(Request $request, int $chapter)
    {
        $data=$request->validate(['courseId'=>'required|string|max:120','answers'=>'required|array|min:1']);
        $state=$this->state($request,$data['courseId']);
        abort_unless($chapter>=1 && $chapter<=12,404,'Excel chapter not found.');
        abort_unless($chapter===1 || $this->chapterPassed($state,$chapter-1),403,'Excel chapter is locked.');
        abort_unless($this->chapterLessonsComplete($state,$chapter),403,'Complete all 3 Excel lessons first.');
        $score=$this->score($data['answers'],$this->chapterQuestions($chapter));$passed=$score>=self::PASS;
        $passedChapters=$this->arr($state->excel_passed_chapters);
        if($passed && !in_array($chapter,$passedChapters,true)) $passedChapters[]=$chapter;
        if($passed) DB::table('student_learning_states')->where('id',$state->id)->update(['excel_passed_chapters'=>json_encode($passedChapters),'updated_at'=>now()]);
        $this->attempt($request,$data['courseId'],'excel_chapter_test',$chapter,$score,$passed,$data['answers']);
        return response()->json(['passed'=>$passed,'score'=>$score,'passingScore'=>self::PASS,'message'=>$passed?'Excel chapter passed. Next chapter unlocked.':'Test pass nahi hua. Lessons revise karke dobara try karein.']);
    }

    public function finalTest(Request $request)
    {
        $state=$this->state($request);
        abort_unless(count($this->arr($state->excel_passed_chapters))===12,403,'Pass all 12 Excel chapter tests first.');
        return response()->json(['questions'=>array_map(fn($q)=>['q'=>$q['q'],'options'=>$q['options']],$this->finalQuestions()),'passingScore'=>self::PASS]);
    }

    public function submitFinalTest(Request $request)
    {
        $data=$request->validate(['courseId'=>'required|string|max:120','answers'=>'required|array|min:1']);
        $state=$this->state($request,$data['courseId']);
        abort_unless(count($this->arr($state->excel_passed_chapters))===12,403,'Pass all 12 Excel chapter tests first.');
        $score=$this->score($data['answers'],$this->finalQuestions());$passed=$score>=self::PASS;
        if($passed) DB::table('student_learning_states')->where('id',$state->id)->update(['excel_final_passed'=>true,'updated_at'=>now()]);
        $this->attempt($request,$data['courseId'],'excel_final',$score===0?null:null,$score,$passed,$data['answers']);
        return response()->json(['passed'=>$passed,'score'=>$score,'passingScore'=>self::PASS,'message'=>$passed?'Congratulations! Microsoft Excel course completed.':'Final test pass nahi hua. Dobara tayari karein.']);
    }
}
