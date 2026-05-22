
import { Language, Course, ServiceCategory, CertificateData } from './types';

export const TRANSLATIONS: any = {
  // ... (Existing translations preserved) ...
  fill_all_fields: { [Language.ENGLISH]: 'Please fill all fields', [Language.URDU]: 'براہ کرم تمام خانے پُر کریں', [Language.ARABIC]: 'يرجى ملء جميع الحقول', [Language.RUSSIAN]: 'Пожалуйста, заполните все поля' },
  invalid_login: { [Language.ENGLISH]: 'Invalid credentials', [Language.URDU]: 'غلط اسناد', [Language.ARABIC]: 'اعتماد غير صالح', [Language.RUSSIAN]: 'Неверные учетные данные' },
  id_required: { [Language.ENGLISH]: 'Student ID is required', [Language.URDU]: 'اسٹوڈنٹ آئی ڈی درکار ہے', [Language.ARABIC]: 'معرف الطالب مطلوب', [Language.RUSSIAN]: 'Требуется студенческий ID' },
  id_alphanumeric: { [Language.ENGLISH]: 'Must contain only letters and numbers', [Language.URDU]: 'صرف حروف اور نمبر ہونے چاہئیں', [Language.ARABIC]: 'يجب أن يحتوي فقط على حروف وأرقام', [Language.RUSSIAN]: 'Должен содержать только буквы и цифры' },
  id_length: { [Language.ENGLISH]: 'Must be between 5 and 10 characters', [Language.URDU]: '5 سے 10 حروف کے درمیان ہونا چاہیے', [Language.ARABIC]: 'يجب أن يكون بين 5 و 10 أحرف', [Language.RUSSIAN]: 'Должен содержать от 5 до 10 символов' },
  course_interest: { [Language.ENGLISH]: 'Course of Interest', [Language.URDU]: 'دلچسپی کا کورس', [Language.ARABIC]: 'الدورة التي تهمك', [Language.RUSSIAN]: 'Интересующий курс' },
  
  // Navigation
  home: { [Language.ENGLISH]: 'Home', [Language.URDU]: 'ہوم' },
  services: { [Language.ENGLISH]: 'Services', [Language.URDU]: 'خدمات' },
  academy: { [Language.ENGLISH]: 'Academy', [Language.URDU]: 'اکیڈمی' },
  marketplace: { [Language.ENGLISH]: 'Marketplace', [Language.URDU]: 'مارکیٹ پلیس', [Language.ARABIC]: 'السوق', [Language.RUSSIAN]: 'Рынок' },
  jobs: { [Language.ENGLISH]: 'Jobs', [Language.URDU]: 'ملازمتیں', [Language.ARABIC]: 'وظائف', [Language.RUSSIAN]: 'Вакансии' },
  tools: { [Language.ENGLISH]: 'AI Tools', [Language.URDU]: 'AI ٹولز', [Language.ARABIC]: 'أدوات الذكاء الاصطناعي', [Language.RUSSIAN]: 'AI Инструменты' },
  startup: { [Language.ENGLISH]: 'Incubator', [Language.URDU]: 'انکیوبیٹر', [Language.ARABIC]: 'حاضنة', [Language.RUSSIAN]: 'Инкубатор' },
  about: { [Language.ENGLISH]: 'About', [Language.URDU]: 'ہمارے بارے میں' },
  contact: { [Language.ENGLISH]: 'Contact', [Language.URDU]: 'رابطہ' },
  apply: { [Language.ENGLISH]: 'Apply', [Language.URDU]: 'اپلائی کریں' },
  search: { [Language.ENGLISH]: 'Search...', [Language.URDU]: 'تلاش کریں...' },
  login: { [Language.ENGLISH]: 'Login', [Language.URDU]: 'لاگ ان' },
  signup: { [Language.ENGLISH]: 'Sign Up', [Language.URDU]: 'سائن اپ' },

  // Super Platform
  super_tagline: { [Language.ENGLISH]: 'Where Innovation Finds Direction', [Language.URDU]: 'جہاں جدت کو سمت ملتی ہے', [Language.ARABIC]: 'حيث يجد الابتكار الاتجاه', [Language.RUSSIAN]: 'Где инновации находят направление' },
  eco_learn: { [Language.ENGLISH]: 'Learn Skills', [Language.URDU]: 'مہارتیں سیکھیں', [Language.ARABIC]: 'تعلم المهارات', [Language.RUSSIAN]: 'Учить навыки' },
  eco_earn: { [Language.ENGLISH]: 'Earn Money', [Language.URDU]: 'پیسہ کمائیں', [Language.ARABIC]: 'كسب المال', [Language.RUSSIAN]: 'Зарабатывать' },
  eco_hire: { [Language.ENGLISH]: 'Hire Talent', [Language.URDU]: 'ٹیلنٹ ہائر کریں', [Language.ARABIC]: 'توظيف المواهب', [Language.RUSSIAN]: 'Нанять талант' },
  eco_grow: { [Language.ENGLISH]: 'Grow Business', [Language.URDU]: 'کاروبار بڑھائیں', [Language.ARABIC]: 'تنمية الأعمال', [Language.RUSSIAN]: 'Рост бизнеса' },

  // Blockchain & Badges
  bc_verified: { [Language.ENGLISH]: 'Blockchain Verified', [Language.URDU]: 'بلاک چین تصدیق شدہ', [Language.ARABIC]: 'موثق عبر البلوكشين', [Language.RUSSIAN]: 'Проверено блокчейном' },
  bc_view_proof: { [Language.ENGLISH]: 'View On-Chain Proof', [Language.URDU]: 'آن چین ثبوت دیکھیں', [Language.ARABIC]: 'عرض إثبات السلسلة', [Language.RUSSIAN]: 'Смотреть доказательство' },
  bc_network: { [Language.ENGLISH]: 'Network', [Language.URDU]: 'نیٹ ورک', [Language.ARABIC]: 'شبكة', [Language.RUSSIAN]: 'Сеть' },
  bc_tx_hash: { [Language.ENGLISH]: 'Transaction Hash', [Language.URDU]: 'ٹرانزیکشن ہیش', [Language.ARABIC]: 'تجزئة المعاملة', [Language.RUSSIAN]: 'Хеш транзакции' },
  bc_authenticity: { [Language.ENGLISH]: 'Authenticity Check', [Language.URDU]: 'صداقت کی جانچ', [Language.ARABIC]: 'فحص الأصالة', [Language.RUSSIAN]: 'Проверка подлинности' },
  bc_tamper_proof: { [Language.ENGLISH]: 'Tamper-Proof', [Language.URDU]: 'ٹیمپر پروف', [Language.ARABIC]: 'ضد التلاعب', [Language.RUSSIAN]: 'Защита от подделки' },
  
  // Attestation
  attestation_req: { [Language.ENGLISH]: 'Request Attestation', [Language.URDU]: 'تصدیق کی درخواست کریں', [Language.ARABIC]: 'طلب تصديق', [Language.RUSSIAN]: 'Запрос на аттестацию' },
  attestation_status: { [Language.ENGLISH]: 'Attestation Status', [Language.URDU]: 'تصدیق کی حالت', [Language.ARABIC]: 'حالة التصديق', [Language.RUSSIAN]: 'Статус аттестации' },
  official_seal: { [Language.ENGLISH]: 'Official Seal', [Language.URDU]: 'سرکاری مہر', [Language.ARABIC]: 'الختم الرسمي', [Language.RUSSIAN]: 'Официальная печать' },
  view_attestation: { [Language.ENGLISH]: 'View Record', [Language.URDU]: 'ریکارڈ دیکھیں', [Language.ARABIC]: 'عرض السجل', [Language.RUSSIAN]: 'Просмотр записи' },

  // Badge Specific
  skill_badges: { [Language.ENGLISH]: 'Skill Badges', [Language.URDU]: 'مہارت کے بیجز', [Language.ARABIC]: 'شارات المهارة', [Language.RUSSIAN]: 'Значки навыков' },
  badge_level: { [Language.ENGLISH]: 'Skill Level', [Language.URDU]: 'مہارت کا درجہ', [Language.ARABIC]: 'مستوى المهارة', [Language.RUSSIAN]: 'Уровень навыка' },
  badge_issued: { [Language.ENGLISH]: 'Issued On', [Language.URDU]: 'جاری کردہ', [Language.ARABIC]: 'صدر في', [Language.RUSSIAN]: 'Выдан' },
  badge_verify_link: { [Language.ENGLISH]: 'Verify Badge', [Language.URDU]: 'بیج کی تصدیق کریں', [Language.ARABIC]: 'تحقق من الشارة', [Language.RUSSIAN]: 'Проверить значок' },
  badge_share_linkedin: { [Language.ENGLISH]: 'Share on LinkedIn', [Language.URDU]: 'لنکڈ ان پر شیئر کریں', [Language.ARABIC]: 'شارك على LinkedIn', [Language.RUSSIAN]: 'Поделиться в LinkedIn' },

  // Employer API
  emp_portal: { [Language.ENGLISH]: 'Employer Portal', [Language.URDU]: 'ایمپلائر پورٹل', [Language.ARABIC]: 'بوابة أصحاب العمل', [Language.RUSSIAN]: 'Портал работодателя' },
  emp_api_key: { [Language.ENGLISH]: 'API Key Management', [Language.URDU]: 'API کلید کا انتظام', [Language.ARABIC]: 'إدارة مفاتيح API', [Language.RUSSIAN]: 'Управление ключами API' },
  emp_bulk_verify: { [Language.ENGLISH]: 'Bulk Verification', [Language.URDU]: 'بلک تصدیق', [Language.ARABIC]: 'التحقق الجماعي', [Language.RUSSIAN]: 'Массовая проверка' },
  emp_docs: { [Language.ENGLISH]: 'API Documentation', [Language.URDU]: 'API دستاویزات', [Language.ARABIC]: 'وثائق API', [Language.RUSSIAN]: 'Документация API' },
  emp_logs: { [Language.ENGLISH]: 'Request Logs', [Language.URDU]: 'درخواست لاگز', [Language.ARABIC]: 'سجلات الطلبات', [Language.RUSSIAN]: 'Журналы запросов' },

  // Common Form Labels (NEW)
  form_institute_name: { [Language.ENGLISH]: 'Institute Name', [Language.URDU]: 'انسٹی ٹیوٹ کا نام', [Language.ARABIC]: 'اسم المعهد', [Language.RUSSIAN]: 'Название института' },
  form_tagline: { [Language.ENGLISH]: 'Tagline (Optional)', [Language.URDU]: 'ٹیگ لائن (اختیاری)', [Language.ARABIC]: 'شعار (اختياري)', [Language.RUSSIAN]: 'Слоган (необязательно)' },
  form_website: { [Language.ENGLISH]: 'Website URL', [Language.URDU]: 'ویب سائٹ کا لنک', [Language.ARABIC]: 'رابط الموقع', [Language.RUSSIAN]: 'URL веб-сайта' },
  form_brand_color: { [Language.ENGLISH]: 'Brand Color', [Language.URDU]: 'برانڈ کا رنگ', [Language.ARABIC]: 'لون العلامة التجارية', [Language.RUSSIAN]: 'Цвет бренда' },
  form_logo_url: { [Language.ENGLISH]: 'Logo URL', [Language.URDU]: 'لوگو کا لنک', [Language.ARABIC]: 'رابط الشعار', [Language.RUSSIAN]: 'URL логотипа' },
  form_custom_subdomain: { [Language.ENGLISH]: 'Custom Subdomain', [Language.URDU]: 'کسٹم سب ڈومین', [Language.ARABIC]: 'نطاق فرعي مخصص', [Language.RUSSIAN]: 'Пользовательский поддомен' },
  
  lbl_city: { [Language.ENGLISH]: 'City', [Language.URDU]: 'شہر', [Language.ARABIC]: 'مدينة', [Language.RUSSIAN]: 'Город' },
  lbl_country: { [Language.ENGLISH]: 'Country', [Language.URDU]: 'ملک', [Language.ARABIC]: 'دولة', [Language.RUSSIAN]: 'Страна' },
  lbl_franchise_type: { [Language.ENGLISH]: 'Franchise Type', [Language.URDU]: 'فرنچائز کی قسم', [Language.ARABIC]: 'نوع الامتياز', [Language.RUSSIAN]: 'Тип франшизы' },
  lbl_investment: { [Language.ENGLISH]: 'Investment Range', [Language.URDU]: 'سرمایہ کاری کی حد', [Language.ARABIC]: 'نطاق الاستثمار', [Language.RUSSIAN]: 'Диапазон инвестиций' },
  lbl_experience: { [Language.ENGLISH]: 'Experience', [Language.URDU]: 'تجربہ', [Language.ARABIC]: 'خبرة', [Language.RUSSIAN]: 'Опыт' },
  lbl_upload_cv: { [Language.ENGLISH]: 'Upload CV / Resume', [Language.URDU]: 'سی وی / ریزیومے اپ لوڈ کریں', [Language.ARABIC]: 'تحميل السيرة الذاتية', [Language.RUSSIAN]: 'Загрузить резюме' },
  
  // Interactive Labels
  lbl_input: { [Language.ENGLISH]: 'Input', [Language.URDU]: 'ان پٹ', [Language.ARABIC]: 'إدخال', [Language.RUSSIAN]: 'Ввод' },
  lbl_output: { [Language.ENGLISH]: 'Output', [Language.URDU]: 'آؤٹ پٹ', [Language.ARABIC]: 'مخرجات', [Language.RUSSIAN]: 'Вывод' },
  
  // Action Buttons
  btn_generate: { [Language.ENGLISH]: 'Generate', [Language.URDU]: 'بنائیں', [Language.ARABIC]: 'توليد', [Language.RUSSIAN]: 'Генерировать' },
  btn_hire_now: { [Language.ENGLISH]: 'Hire Now', [Language.URDU]: 'ابھی ہائر کریں', [Language.ARABIC]: 'وظف الآن', [Language.RUSSIAN]: 'Нанять сейчас' },
  btn_message: { [Language.ENGLISH]: 'Message', [Language.URDU]: 'پیغام', [Language.ARABIC]: 'رسالة', [Language.RUSSIAN]: 'Сообщение' },
  btn_submit_app: { [Language.ENGLISH]: 'Submit Application', [Language.URDU]: 'درخواست جمع کرائیں', [Language.ARABIC]: 'تقديم الطلب', [Language.RUSSIAN]: 'Подать заявку' },
  btn_next: { [Language.ENGLISH]: 'Next Step', [Language.URDU]: 'اگلا مرحلہ', [Language.ARABIC]: 'الخطوة التالية', [Language.RUSSIAN]: 'Следующий шаг' },
  btn_back: { [Language.ENGLISH]: 'Back', [Language.URDU]: 'واپس', [Language.ARABIC]: 'خلف', [Language.RUSSIAN]: 'Назад' },
  btn_create_workspace: { [Language.ENGLISH]: 'Create Workspace', [Language.URDU]: 'ورک اسپیس بنائیں', [Language.ARABIC]: 'إنشاء مساحة عمل', [Language.RUSSIAN]: 'Создать рабочее пространство' },

  // Headers
  business_details: { [Language.ENGLISH]: 'Business Details', [Language.URDU]: 'کاروباری تفصیلات', [Language.ARABIC]: 'تفاصيل العمل', [Language.RUSSIAN]: 'Детали бизнеса' },
  owner_name: { [Language.ENGLISH]: 'Owner Full Name', [Language.URDU]: 'مالک کا پورا نام', [Language.ARABIC]: 'الاسم الكامل للمالك', [Language.RUSSIAN]: 'ФИО владельца' },
  location_strategy: { [Language.ENGLISH]: 'Location & Strategy', [Language.URDU]: 'مقام اور حکمت عملی', [Language.ARABIC]: 'الموقع والاستراتيجية', [Language.RUSSIAN]: 'Локация и стратегия' },
  
  institute_profile: { [Language.ENGLISH]: 'Institute Profile', [Language.URDU]: 'انسٹی ٹیوٹ پروفائل', [Language.ARABIC]: 'ملف المعهد', [Language.RUSSIAN]: 'Профиль института' },
  white_label_branding: { [Language.ENGLISH]: 'White-Label Branding', [Language.URDU]: 'وائٹ لیبل برانڈنگ', [Language.ARABIC]: 'العلامة التجارية البيضاء', [Language.RUSSIAN]: 'White-Label брендинг' },
  ready_launch: { [Language.ENGLISH]: 'Ready to Launch?', [Language.URDU]: 'لانچ کے لیے تیار ہیں؟', [Language.ARABIC]: 'جاهز للإطلاق؟', [Language.RUSSIAN]: 'Готовы к запуску?' },
  
  find_talent: { [Language.ENGLISH]: 'Find Top Talent', [Language.URDU]: 'بہترین ٹیلنٹ تلاش کریں', [Language.ARABIC]: 'ابحث عن أفضل المواهب', [Language.RUSSIAN]: 'Найти лучшие таланты' },
  popular_gigs: { [Language.ENGLISH]: 'Popular Gigs', [Language.URDU]: 'مقبول گگز', [Language.ARABIC]: 'الخدمات الشائعة', [Language.RUSSIAN]: 'Популярные услуги' },
  starting_at: { [Language.ENGLISH]: 'Starting at', [Language.URDU]: 'شروع ہوتا ہے', [Language.ARABIC]: 'يبدأ من', [Language.RUSSIAN]: 'Начиная с' },
  find_job: { [Language.ENGLISH]: 'Find Your Dream Job', [Language.URDU]: 'اپنی خوابوں کی نوکری تلاش کریں', [Language.ARABIC]: 'ابحث عن وظيفة أحلامك', [Language.RUSSIAN]: 'Найдите работу мечты' },
  apply_job: { [Language.ENGLISH]: 'Apply', [Language.URDU]: 'درخواست دیں', [Language.ARABIC]: 'تقديم', [Language.RUSSIAN]: 'Подать заявку' },
  
  ai_super_tools: { [Language.ENGLISH]: 'AI Super Tools', [Language.URDU]: 'AI سپر ٹولز', [Language.ARABIC]: 'أدوات الذكاء الاصطناعي الفائقة', [Language.RUSSIAN]: 'Супер AI инструменты' },
  launch_tool: { [Language.ENGLISH]: 'Launch Tool', [Language.URDU]: 'ٹول لانچ کریں', [Language.ARABIC]: 'تشغيل الأداة', [Language.RUSSIAN]: 'Запустить инструмент' },

  // Footer
  footerDesc: { [Language.ENGLISH]: 'Empowering the next generation with digital skills.', [Language.URDU]: 'اگلی نسل کو ڈیجیٹل مہارتوں سے بااختیار بنانا۔', [Language.ARABIC]: 'تمكين الجيل القادم بالمهارات الرقمية.', [Language.RUSSIAN]: 'Расширение возможностей следующего поколения цифровыми навыками.' },
  trusted_partner: { [Language.ENGLISH]: 'Trusted Partner - Digital Solutions Hub', [Language.URDU]: 'قابل اعتماد پارٹنر - ڈیجیٹل سلوشنز ہب', [Language.ARABIC]: 'شريك موثوق - Digital Solutions Hub', [Language.RUSSIAN]: 'Надежный партнер - Digital Solutions Hub' },
  quickLinks: { [Language.ENGLISH]: 'Quick Links', [Language.URDU]: 'فوری روابط', [Language.ARABIC]: 'روابط سريعة', [Language.RUSSIAN]: 'Быстрые ссылки' },
  ctaApply: { [Language.ENGLISH]: 'Apply Now', [Language.URDU]: 'ابھی اپلائی کریں', [Language.ARABIC]: 'قدم الآن', [Language.RUSSIAN]: 'Подать заявку' },
  privacy_policy: { [Language.ENGLISH]: 'Privacy Policy', [Language.URDU]: 'رازداری کی پالیسی', [Language.ARABIC]: 'سياسة الخصوصية', [Language.RUSSIAN]: 'Политика конфиденциальности' },
  terms_conditions: { [Language.ENGLISH]: 'Terms & Conditions', [Language.URDU]: 'شرائط و ضوابط', [Language.ARABIC]: 'الشروط والأحكام', [Language.RUSSIAN]: 'Условия и положения' },
  contactUs: { [Language.ENGLISH]: 'Contact Us', [Language.URDU]: 'ہم سے رابطہ کریں', [Language.ARABIC]: 'اتصل بنا', [Language.RUSSIAN]: 'Связаться с нами' },
  address: { [Language.ENGLISH]: 'Islamabad, Pakistan', [Language.URDU]: 'اسلام آباد، پاکستان', [Language.ARABIC]: 'إسلام آباد، باكستان', [Language.RUSSIAN]: 'Исламабад, Пакистан' },
  newsletter: { [Language.ENGLISH]: 'Newsletter', [Language.URDU]: 'نیوز لیٹر', [Language.ARABIC]: 'النشرة الإخبارية', [Language.RUSSIAN]: 'Новостная рассылка' },
  subscribeDesc: { [Language.ENGLISH]: 'Subscribe to our newsletter for updates.', [Language.URDU]: 'اپ ڈیٹس کے لیے ہمارے نیوز لیٹر کو سبسکرائب کریں۔', [Language.ARABIC]: 'اشترك في نشرتنا الإخبارية للحصول على التحديثات.', [Language.RUSSIAN]: 'Подпишитесь на нашу рассылку новостей.' },
  enterEmail: { [Language.ENGLISH]: 'Enter your email', [Language.URDU]: 'اپنا ای میل درج کریں', [Language.ARABIC]: 'أدخل بريدك الإلكتروني', [Language.RUSSIAN]: 'Введите ваш email' },
  subscribeBtn: { [Language.ENGLISH]: 'Subscribe', [Language.URDU]: 'سبسکرائب', [Language.ARABIC]: 'اشتراك', [Language.RUSSIAN]: 'Подписаться' },
  ssl_secured: { [Language.ENGLISH]: 'SSL Secured', [Language.URDU]: 'SSL محفوظ', [Language.ARABIC]: 'مؤمن بـ SSL', [Language.RUSSIAN]: 'Защищено SSL' },
  data_protection_notice: { [Language.ENGLISH]: 'Your data is safe with us.', [Language.URDU]: 'آپ کا ڈیٹا ہمارے پاس محفوظ ہے۔', [Language.ARABIC]: 'بياناتك آمنة معنا.', [Language.RUSSIAN]: 'Ваши данные в безопасности.' },

  // --- OPTIMIZED SEO METADATA ---
  
  // Home
  metaTitleHome: { 
    [Language.ENGLISH]: 'Digital Solutions Hub - Learn Skills, Earn Money, Hire Talent',
    [Language.URDU]: 'ڈیجیٹل سلوشنز ہب - مہارتیں سیکھیں، پیسے کمائیں، ٹیلنٹ ہائر کریں',
    [Language.ARABIC]: 'مركز الحلول الرقمية - تعلم المهارات، واكسب المال، ووظف المواهب',
    [Language.RUSSIAN]: 'Digital Solutions Hub - Учитесь, зарабатывайте, нанимайте таланты'
  },
  metaDescHome: {
    [Language.ENGLISH]: 'The ultimate digital ecosystem in Pakistan. Learn SEO, Web Development, and AI. Find freelance jobs, hire experts, and grow your business with Digital Solutions Hub.',
    [Language.URDU]: 'پاکستان کا بہترین ڈیجیٹل ایکو سسٹم۔ SEO، ویب ڈویلپمنٹ، اور AI سیکھیں۔ فری لانس جابز تلاش کریں، ماہرین کو ہائر کریں، اور اپنا کاروبار بڑھائیں۔',
    [Language.ARABIC]: 'النظام البيئي الرقمي النهائي في باكستان. تعلم تحسين محركات البحث، وتطوير الويب، والذكاء الاصطناعي. ابحث عن وظائف مستقلة، ووظف الخبراء، وقم بتنمية عملك.',
    [Language.RUSSIAN]: 'Ультимативная цифровая экосистема. Изучайте SEO, веб-разработку и ИИ. Находите фриланс-работу, нанимайте экспертов и развивайте свой бизнес.'
  },
  home_tagline: { [Language.ENGLISH]: 'Your Future Starts Here', [Language.URDU]: 'آپ کا مستقبل یہاں سے شروع ہوتا ہے' },
  heroTitle: { [Language.ENGLISH]: 'Master Digital Skills', [Language.URDU]: 'ڈیجیٹل مہارتوں میں مہارت حاصل کریں' },
  heroSubtitle: { [Language.ENGLISH]: 'Join thousands of students learning modern skills.', [Language.URDU]: 'جدید مہارتیں سیکھنے والے ہزاروں طلباء میں شامل ہوں۔' },
  join_student: { [Language.ENGLISH]: 'Join as Student', [Language.URDU]: 'بطور طالب علم شامل ہوں' },
  hire_us: { [Language.ENGLISH]: 'Hire Us', [Language.URDU]: 'ہمیں ہائر کریں' },
  what_we_do: { [Language.ENGLISH]: 'What We Do', [Language.URDU]: 'ہم کیا کرتے ہیں' },
  wd_training: { [Language.ENGLISH]: 'Training', [Language.URDU]: 'تربیت' },
  wd_marketing: { [Language.ENGLISH]: 'Marketing', [Language.URDU]: 'مارکیٹنگ' },
  wd_ai: { [Language.ENGLISH]: 'AI Solutions', [Language.URDU]: 'AI حل' },
  wd_seo: { [Language.ENGLISH]: 'SEO', [Language.URDU]: 'SEO' },
  wd_money: { [Language.ENGLISH]: 'Monetization', [Language.URDU]: 'منیٹائزیشن' },
  ai_automation_title: { [Language.ENGLISH]: 'AI & Automation', [Language.URDU]: 'AI اور آٹومیشن' },
  ai_desc: { [Language.ENGLISH]: 'Automate your business with AI.', [Language.URDU]: 'اپنے کاروبار کو AI کے ساتھ خودکار بنائیں۔' },
  why_us: { [Language.ENGLISH]: 'Why Choose Us', [Language.URDU]: 'ہمیں کیوں منتخب کریں' },
  why_real: { [Language.ENGLISH]: 'Real World Skills', [Language.URDU]: 'حقیقی دنیا کی مہارتیں' },
  why_ai: { [Language.ENGLISH]: 'AI Integration', [Language.URDU]: 'AI انضمام' },
  why_portals: { [Language.ENGLISH]: 'Dedicated Portals', [Language.URDU]: 'وقف شدہ پورٹلز' },
  why_lang: { [Language.ENGLISH]: 'Multi-language Support', [Language.URDU]: 'کثیر لسانی تعاون' },
  why_guide: { [Language.ENGLISH]: 'Expert Guidance', [Language.URDU]: 'ماہرانہ رہنمائی' },

  // About
  metaTitleAbout: {
    [Language.ENGLISH]: 'About Us - Digital Solutions Hub | Sarkar Azeem',
    [Language.URDU]: 'ہمارے بارے میں - ڈیجیٹل سلوشنز ہب | سرکار عظیم',
    [Language.ARABIC]: 'من نحن - مركز الحلول الرقمية | سركار عظيم',
    [Language.RUSSIAN]: 'О нас - Digital Solutions Hub | Саркар Азим'
  },
  metaDescAbout: {
    [Language.ENGLISH]: 'Learn about Digital Solutions Hub, founded by Sarkar Azeem. We are bridging the gap between talent and opportunity through digital education and services.',
    [Language.URDU]: 'ڈیجیٹل سلوشنز ہب کے بارے میں جانیں، جس کی بنیاد سرکار عظیم نے رکھی۔ ہم ڈیجیٹل تعلیم اور خدمات کے ذریعے ہنر اور مواقع کے درمیان خلیج کو ختم کر رہے ہیں۔',
    [Language.ARABIC]: 'تعرف على مركز الحلول الرقمية، الذي أسسه سركار عظيم. نحن نسد الفجوة بين المواهب والفرص من خلال التعليم والخدمات الرقمية.',
    [Language.RUSSIAN]: 'Узнайте о Digital Solutions Hub, основанном Саркаром Азимом. Мы преодолеваем разрыв между талантами и возможностями с помощью цифрового образования.'
  },

  // Academy
  metaTitleAcademy: {
    [Language.ENGLISH]: 'DSH Academy - Online Courses for SEO, Web Dev & Freelancing',
    [Language.URDU]: 'DSH اکیڈمی - SEO، ویب ڈیولپمنٹ اور فری لانسنگ کے آن لائن کورسز',
    [Language.ARABIC]: 'أكاديمية DSH - دورات عبر الإنترنت في SEO وتطوير الويب والعمل الحر',
    [Language.RUSSIAN]: 'Академия DSH - Онлайн курсы по SEO, веб-разработке и фрилансу'
  },
  metaDescAcademy: {
    [Language.ENGLISH]: 'Enroll in top-rated online courses at DSH Academy. Master Shopify, Digital Marketing, Graphic Design, and AI tools with verified certificates.',
    [Language.URDU]: 'DSH اکیڈمی میں بہترین آن لائن کورسز میں داخلہ لیں۔ تصدیق شدہ سرٹیفکیٹس کے ساتھ شاپائف، ڈیجیٹل مارکیٹنگ، گرافک ڈیزائن، اور AI ٹولز میں مہارت حاصل کریں۔',
    [Language.ARABIC]: 'سجل في أفضل الدورات عبر الإنترنت في أكاديمية DSH. أتقن شوبيفاي، التسويق الرقمي، التصميم الجرافيكي، وأدوات الذكاء الاصطناعي مع شهادات معتمدة.',
    [Language.RUSSIAN]: 'Запишитесь на лучшие онлайн-курсы в Академии DSH. Освойте Shopify, цифровой маркетинг, графический дизайн и инструменты ИИ с подтвержденными сертификатами.'
  },
  what_learn: { [Language.ENGLISH]: 'What You Will Learn', [Language.URDU]: 'آپ کیا سیکھیں گے' },
  student_benefits: { [Language.ENGLISH]: 'Student Benefits', [Language.URDU]: 'طالب علم کے فوائد' },
  sb_daily: { [Language.ENGLISH]: 'Daily Lessons', [Language.URDU]: 'روزانہ اسباق' },
  sb_dash: { [Language.ENGLISH]: 'Student Dashboard', [Language.URDU]: 'طالب علم ڈیش بورڈ' },
  sb_live: { [Language.ENGLISH]: 'Live Sessions', [Language.URDU]: 'لائیو سیشنز' },
  sb_cert: { [Language.ENGLISH]: 'Certification', [Language.URDU]: 'سرٹیفیکیشن' },
  sb_career: { [Language.ENGLISH]: 'Career Support', [Language.URDU]: 'کیریئر سپورٹ' },
  enroll_now: { [Language.ENGLISH]: 'Enroll Now', [Language.URDU]: 'ابھی داخلہ لیں' },

  // Services
  metaTitleServices: {
    [Language.ENGLISH]: 'Digital Services - Web Development, SEO & Marketing Agency',
    [Language.URDU]: 'ڈیجیٹل خدمات - ویب ڈیولپمنٹ، SEO اور مارکیٹنگ ایجنسی',
    [Language.ARABIC]: 'الخدمات الرقمية - تطوير الويب، تحسين محركات البحث ووكالة التسويق',
    [Language.RUSSIAN]: 'Цифровые услуги - Веб-разработка, SEO и Маркетинговое агентство'
  },
  metaDescServices: {
    [Language.ENGLISH]: 'Hire Digital Solutions Hub for professional web development, SEO ranking, social media marketing, and AI automation services to grow your business.',
    [Language.URDU]: 'اپنے کاروبار کو بڑھانے کے لیے ڈیجیٹل سلوشنز ہب کو پیشہ ورانہ ویب ڈیولپمنٹ، SEO رینکنگ، سوشل میڈیا مارکیٹنگ، اور AI آٹومیشن خدمات کے لیے ہائر کریں۔',
    [Language.ARABIC]: 'وظف مركز الحلول الرقمية لخدمات تطوير الويب الاحترافية، وتصنيف SEO، وتسويق وسائل التواصل الاجتماعي، وأتمتة الذكاء الاصطناعي لتنمية عملك.',
    [Language.RUSSIAN]: 'Наймите Digital Solutions Hub для профессиональной веб-разработки, SEO-продвижения, маркетинга в социальных сетях и услуг автоматизации ИИ.'
  },

  // Marketplace
  metaTitleMarketplace: {
    [Language.ENGLISH]: 'Freelance Marketplace - Hire Top Talent & Buy Gigs',
    [Language.URDU]: 'فری لانس مارکیٹ پلیس - بہترین ٹیلنٹ ہائر کریں اور گگز خریدیں',
    [Language.ARABIC]: 'سوق العمل الحر - وظف أفضل المواهب واشترِ الخدمات',
    [Language.RUSSIAN]: 'Фриланс-биржа - Нанимайте лучших талантов и покупайте услуги'
  },
  metaDescMarketplace: {
    [Language.ENGLISH]: 'Find and hire expert freelancers for your projects. Buy affordable gigs for logo design, content writing, coding, and more on DSH Marketplace.',
    [Language.URDU]: 'اپنے پروجیکٹس کے لیے ماہر فری لانسرز تلاش کریں اور ہائر کریں۔ DSH مارکیٹ پلیس پر لوگو ڈیزائن، مواد کی تحریر، کوڈنگ، اور مزید کے لیے سستی گگز خریدیں۔',
    [Language.ARABIC]: 'ابحث عن وظف مستقلين خبراء لمشاريعك. اشترِ خدمات بأسعار معقولة لتصميم الشعارات، وكتابة المحتوى، والبرمجة، والمزيد في سوق DSH.',
    [Language.RUSSIAN]: 'Находите и нанимайте экспертов-фрилансеров для своих проектов. Покупайте доступные услуги по дизайну логотипов, написанию контента, кодированию и многому другому на DSH Marketplace.'
  },

  // Jobs
  metaTitleJobs: {
    [Language.ENGLISH]: 'Job Portal - Find Remote Jobs & Internships in Tech',
    [Language.URDU]: 'جاب پورٹل - ٹیک میں ریموٹ نوکریاں اور انٹرنشپ تلاش کریں',
    [Language.ARABIC]: 'بوابة الوظائف - ابحث عن وظائف عن بعد وتدريب داخلي في التكنولوجيا',
    [Language.RUSSIAN]: 'Портал вакансий - Найти удаленную работу и стажировки в Tech'
  },
  metaDescJobs: {
    [Language.ENGLISH]: 'Apply for the latest remote jobs, internships, and full-time positions in web development, marketing, and SEO. Launch your career with DSH.',
    [Language.URDU]: 'ویب ڈیولپمنٹ، مارکیٹنگ، اور SEO میں تازہ ترین ریموٹ نوکریوں، انٹرنشپ، اور کل وقتی اسامیوں کے لیے درخواست دیں۔ DSH کے ساتھ اپنا کیریئر شروع کریں۔',
    [Language.ARABIC]: 'تقدم بطلب للحصول على أحدث الوظائف عن بعد، والتدريب الداخلي، والوظائف بدوام كامل في تطوير الويب، والتسويق، وتحسين محركات البحث.',
    [Language.RUSSIAN]: 'Подавайте заявки на последние удаленные вакансии, стажировки и позиции с полной занятостью в веб-разработке, маркетинге и SEO.'
  },

  // Tools
  metaTitleTools: {
    [Language.ENGLISH]: 'AI Tools Suite - Free Business Automation Tools',
    [Language.URDU]: 'AI ٹولز سویٹ - مفت کاروباری آٹومیشن ٹولز',
    [Language.ARABIC]: 'مجموعة أدوات الذكاء الاصطناعي - أدوات أتمتة الأعمال المجانية',
    [Language.RUSSIAN]: 'Набор инструментов ИИ - Бесплатные инструменты автоматизации бизнеса'
  },
  metaDescTools: {
    [Language.ENGLISH]: 'Access powerful AI tools for free. Generate content, write code, create images, and automate workflows with DSH AI Suite.',
    [Language.URDU]: 'طاقتور AI ٹولز تک مفت رسائی حاصل کریں۔ مواد بنائیں، کوڈ لکھیں، تصاویر بنائیں، اور DSH AI سویٹ کے ساتھ ورک فلو کو خودکار بنائیں۔',
    [Language.ARABIC]: 'الوصول إلى أدوات الذكاء الاصطناعي القوية مجانًا. أنشئ محتوى، واكتب أكوادًا، وأنشئ صورًا، وأتمتة سير العمل مع مجموعة DSH AI.',
    [Language.RUSSIAN]: 'Получите бесплатный доступ к мощным инструментам ИИ. Создавайте контент, пишите код, создавайте изображения и автоматизируйте рабочие процессы с DSH AI Suite.'
  },

  // Apply
  metaTitleApply: { [Language.ENGLISH]: 'Apply Now - Join Courses & Services', [Language.URDU]: 'ابھی درخواست دیں - کورسز اور خدمات میں شامل ہوں' },
  metaDescApply: { [Language.ENGLISH]: 'Application form for students and clients.', [Language.URDU]: 'طلباء اور کلائنٹس کے لیے درخواست فارم۔' },
  appSubmitted: { [Language.ENGLISH]: 'Application Submitted', [Language.URDU]: 'درخواست جمع کر دی گئی' },
  thankYouApp: { [Language.ENGLISH]: 'Thank you for applying.', [Language.URDU]: 'درخواست دینے کا شکریہ۔' },
  submitAnother: { [Language.ENGLISH]: 'Submit Another', [Language.URDU]: 'ایک اور جمع کرائیں' },
  appType: { [Language.ENGLISH]: 'Application Type', [Language.URDU]: 'درخواست کی قسم' },
  svc_admission: { [Language.ENGLISH]: 'Admission', [Language.URDU]: 'داخلہ' },
  svc_jobs: { [Language.ENGLISH]: 'Job Application', [Language.URDU]: 'ملازمت کی درخواست' },
  svc_skills: { [Language.ENGLISH]: 'Skill Development', [Language.URDU]: 'مہارت کی ترقی' },
  svc_visa: { [Language.ENGLISH]: 'Visa Services', [Language.URDU]: 'ویزا خدمات' },
  svc_fbr: { [Language.ENGLISH]: 'FBR Services', [Language.URDU]: 'FBR خدمات' },
  svc_consult: { [Language.ENGLISH]: 'Consultation', [Language.URDU]: 'مشاورت' },
  full_name: { [Language.ENGLISH]: 'Full Name', [Language.URDU]: 'پورا نام' },
  phone_num: { [Language.ENGLISH]: 'Phone Number', [Language.URDU]: 'فون نمبر' },
  email: { [Language.ENGLISH]: 'Email', [Language.URDU]: 'ای میل' },
  country: { [Language.ENGLISH]: 'Target Country', [Language.URDU]: 'مطلوبہ ملک' },
  uploadDoc: { [Language.ENGLISH]: 'Upload Documents', [Language.URDU]: 'دستاویزات اپ لوڈ کریں' },
  submitApp: { [Language.ENGLISH]: 'Submit Application', [Language.URDU]: 'درخواست جمع کرائیں' },

  // Contact
  metaTitleContact: { [Language.ENGLISH]: 'Contact Us', [Language.URDU]: 'ہم سے رابطہ کریں' },
  metaDescContact: { [Language.ENGLISH]: 'Get in touch with our team.', [Language.URDU]: 'ہماری ٹیم سے رابطہ کریں۔' },

  // Login/Signup
  welcome: { [Language.ENGLISH]: 'Welcome Back', [Language.URDU]: 'خوش آمدید' },
  login_student: { [Language.ENGLISH]: 'Student Login', [Language.URDU]: 'طالب علم لاگ ان' },
  login_client: { [Language.ENGLISH]: 'Client Login', [Language.URDU]: 'کلائنٹ لاگ ان' },
  login_admin: { [Language.ENGLISH]: 'Admin Login', [Language.URDU]: 'ایڈمن لاگ ان' },
  login_security_msg: { [Language.ENGLISH]: 'Secure Login', [Language.URDU]: 'محفوظ لاگ ان' },
  email_phone: { [Language.ENGLISH]: 'Email or Phone', [Language.URDU]: 'ای میل یا فون' },
  password: { [Language.ENGLISH]: 'Password', [Language.URDU]: 'پاس ورڈ' },
  remember_me: { [Language.ENGLISH]: 'Remember Me', [Language.URDU]: 'مجھے یاد رکھیں' },
  forgot_pass: { [Language.ENGLISH]: 'Forgot Password?', [Language.URDU]: 'پاس ورڈ بھول گئے؟' },
  no_account: { [Language.ENGLISH]: 'No account?', [Language.URDU]: 'کوئی اکاؤنٹ نہیں؟' },
  create_account: { [Language.ENGLISH]: 'Create Account', [Language.URDU]: 'اکاؤنٹ بنائیں' },
  signup_student: { [Language.ENGLISH]: 'Student Signup', [Language.URDU]: 'طالب علم سائن اپ' },
  signup_client: { [Language.ENGLISH]: 'Client Signup', [Language.URDU]: 'کلائنٹ سائن اپ' },
  business_name: { [Language.ENGLISH]: 'Business Name', [Language.URDU]: 'کاروبار کا نام' },
  student_id: { [Language.ENGLISH]: 'Student ID', [Language.URDU]: 'طالب علم آئی ڈی' },
  id_hint: { [Language.ENGLISH]: 'Enter your student ID', [Language.URDU]: 'اپنی طالب علم آئی ڈی درج کریں' },
  industry_type: { [Language.ENGLISH]: 'Industry Type', [Language.URDU]: 'صنعت کی قسم' },
  project_type: { [Language.ENGLISH]: 'Project Type', [Language.URDU]: 'پروجیکٹ کی قسم' },
  confirm_pass: { [Language.ENGLISH]: 'Confirm Password', [Language.URDU]: 'پاس ورڈ کی تصدیق کریں' },
  create_student_acc: { [Language.ENGLISH]: 'Create Student Account', [Language.URDU]: 'طالب علم اکاؤنٹ بنائیں' },
  create_client_acc: { [Language.ENGLISH]: 'Create Client Account', [Language.URDU]: 'کلائنٹ اکاؤنٹ بنائیں' },

  // Services Page Specifics
  svc_hero_sub: { [Language.ENGLISH]: 'Professional digital services for your business.', [Language.URDU]: 'آپ کے کاروبار کے لیے پیشہ ورانہ ڈیجیٹل خدمات۔' },
  our_services: { [Language.ENGLISH]: 'Our Services', [Language.URDU]: 'ہماری خدمات' },
  svc_req_btn: { [Language.ENGLISH]: 'Request Service', [Language.URDU]: 'سروس کی درخواست کریں' },
  view_details: { [Language.ENGLISH]: 'View Details', [Language.URDU]: 'تفصیلات دیکھیں' },
  how_it_works: { [Language.ENGLISH]: 'How It Works', [Language.URDU]: 'یہ کیسے کام کرتا ہے' },
  hiw_req: { [Language.ENGLISH]: 'Request', [Language.URDU]: 'درخواست' },
  hiw_prop: { [Language.ENGLISH]: 'Proposal', [Language.URDU]: 'تجویز' },
  hiw_pay: { [Language.ENGLISH]: 'Payment', [Language.URDU]: 'ادائیگی' },
  hiw_deliver: { [Language.ENGLISH]: 'Delivery', [Language.URDU]: 'ڈلیوری' },
  get_consult: { [Language.ENGLISH]: 'Get Consultation', [Language.URDU]: 'مشورہ حاصل کریں' },
  pricing_title: { [Language.ENGLISH]: 'Pricing & Packages', [Language.URDU]: 'قیمتیں اور پیکجز' },
  pricing_sub: { [Language.ENGLISH]: 'Choose the best plan for you.', [Language.URDU]: 'اپنے لیے بہترین منصوبہ منتخب کریں۔' },
  monthly: { [Language.ENGLISH]: 'Monthly', [Language.URDU]: 'ماہانہ' },
  one_time: { [Language.ENGLISH]: 'One Time', [Language.URDU]: 'ایک بار' },
  custom_price: { [Language.ENGLISH]: 'Custom', [Language.URDU]: 'حسب ضرورت' },
  most_popular: { [Language.ENGLISH]: 'Most Popular', [Language.URDU]: 'سب سے زیادہ مقبول' },
  svc_quote_btn: { [Language.ENGLISH]: 'Get a Quote', [Language.URDU]: 'کوٹیشن حاصل کریں' },
  svc_expert_btn: { [Language.ENGLISH]: 'Talk to an Expert', [Language.URDU]: 'ماہر سے بات کریں' },
  form_category: { [Language.ENGLISH]: 'Category', [Language.URDU]: 'زمرہ' },
  form_name: { [Language.ENGLISH]: 'Name', [Language.URDU]: 'نام' },
  form_email: { [Language.ENGLISH]: 'Email', [Language.URDU]: 'ای میل' },
  form_whatsapp: { [Language.ENGLISH]: 'WhatsApp', [Language.URDU]: 'واٹس ایپ' },
  form_budget: { [Language.ENGLISH]: 'Budget', [Language.URDU]: 'بجٹ' },
  form_details: { [Language.ENGLISH]: 'Details', [Language.URDU]: 'تفصیلات' },
  form_submit: { [Language.ENGLISH]: 'Submit', [Language.URDU]: 'جمع کرائیں' },
  form_success: { [Language.ENGLISH]: 'Success!', [Language.URDU]: 'کامیابی!' },
  form_success_msg: { [Language.ENGLISH]: 'We have received your request.', [Language.URDU]: 'ہمیں آپ کی درخواست موصول ہو گئی ہے۔' },
  back_services: { [Language.ENGLISH]: 'Back to Services', [Language.URDU]: 'خدمات پر واپس' },
  key_benefits: { [Language.ENGLISH]: 'Key Benefits', [Language.URDU]: 'اہم فوائد' },
  our_process: { [Language.ENGLISH]: 'Our Process', [Language.URDU]: 'ہمارا عمل' },
  freq_asked: { [Language.ENGLISH]: 'Frequently Asked Questions', [Language.URDU]: 'اکثر پوچھے گئے سوالات' },
  ready_start: { [Language.ENGLISH]: 'Ready to Start?', [Language.URDU]: 'شروع کرنے کے لیے تیار ہیں؟' },
  book_consult: { [Language.ENGLISH]: 'Book Consultation', [Language.URDU]: 'مشورہ بک کریں' },

  // Dashboards
  dashboard: { [Language.ENGLISH]: 'Dashboard', [Language.URDU]: 'ڈیش بورڈ' },
  dash_my_courses: { [Language.ENGLISH]: 'My Courses', [Language.URDU]: 'میرے کورسز' },
  dash_worksheet: { [Language.ENGLISH]: 'Worksheets', [Language.URDU]: 'ورک شیٹس' },
  dash_assignments: { [Language.ENGLISH]: 'Assignments', [Language.URDU]: 'اسائنمنٹس' },
  dash_certificates: { [Language.ENGLISH]: 'Certificates', [Language.URDU]: 'سرٹیفکیٹس' },
  dash_progress: { [Language.ENGLISH]: 'Progress', [Language.URDU]: 'پیشرفت' },
  dash_messages: { [Language.ENGLISH]: 'Messages', [Language.URDU]: 'پیغامات' },
  dash_announcements: { [Language.ENGLISH]: 'Announcements', [Language.URDU]: 'اعلان' },
  dash_support: { [Language.ENGLISH]: 'Support', [Language.URDU]: 'سپورٹ' },
  dash_profile: { [Language.ENGLISH]: 'Profile', [Language.URDU]: 'پروفائل' },
  dash_logout: { [Language.ENGLISH]: 'Logout', [Language.URDU]: 'لاگ آؤٹ' },
  dash_welcome: { [Language.ENGLISH]: 'Welcome', [Language.URDU]: 'خوش آمدید' },
  dash_start_lesson: { [Language.ENGLISH]: 'Start Lesson', [Language.URDU]: 'سبق شروع کریں' },
  dash_settings: { [Language.ENGLISH]: 'Settings', [Language.URDU]: 'ترتیبات' },
  cdash_overview: { [Language.ENGLISH]: 'Overview', [Language.URDU]: 'جائزہ' },
  cdash_projects: { [Language.ENGLISH]: 'Projects', [Language.URDU]: 'پروجیکٹس' },
  cdash_timeline: { [Language.ENGLISH]: 'Timeline', [Language.URDU]: 'ٹائم لائن' },
  cdash_invoices: { [Language.ENGLISH]: 'Invoices', [Language.URDU]: 'انوائسز' },
  cdash_files: { [Language.ENGLISH]: 'Files', [Language.URDU]: 'فائلیں' },
  cdash_create_new: { [Language.ENGLISH]: 'Create New', [Language.URDU]: 'نیا بنائیں' },
  cdash_active_orders: { [Language.ENGLISH]: 'Active Orders', [Language.URDU]: 'فعال آرڈرز' },
  cdash_pending_pay: { [Language.ENGLISH]: 'Pending Payments', [Language.URDU]: 'زیر التواء ادائیگیاں' },
  cdash_completed_proj: { [Language.ENGLISH]: 'Completed Projects', [Language.URDU]: 'مکمل شدہ پروجیکٹس' },
  adash_services: { [Language.ENGLISH]: 'Services', [Language.URDU]: 'خدمات' },
  adash_students: { [Language.ENGLISH]: 'Students', [Language.URDU]: 'طلباء' },
  adash_clients: { [Language.ENGLISH]: 'Clients', [Language.URDU]: 'کلائنٹس' },
  send_message: { [Language.ENGLISH]: 'Send Message', [Language.URDU]: 'پیغام بھیجیں' },

  // Verification Page (NEW)
  verify_page_title: { [Language.ENGLISH]: 'Verify Certificate', [Language.URDU]: 'سرٹیفکیٹ کی تصدیق کریں', [Language.ARABIC]: 'تحقق من الشهادة', [Language.RUSSIAN]: 'Проверить сертификат' },
  verify_page_desc: { [Language.ENGLISH]: 'Instantly verify the authenticity of certificates issued by DSH Academy using our Blockchain Ledger.', [Language.URDU]: 'ہمارے بلاک چین لیجر کا استعمال کرتے ہوئے DSH اکیڈمی کے جاری کردہ سرٹیفکیٹس کی صداقت کی فوری تصدیق کریں۔', [Language.ARABIC]: 'تحقق فوراً من صحة الشهادات الصادرة عن أكاديمية DSH باستخدام سجل البلوكشين الخاص بنا.', [Language.RUSSIAN]: 'Мгновенно проверяйте подлинность сертификатов, выданных Академией DSH, используя наш реестр блокчейна.' },
  enter_cert_id: { [Language.ENGLISH]: 'Enter Certificate ID', [Language.URDU]: 'سرٹیفکیٹ آئی ڈی درج کریں', [Language.ARABIC]: 'أدخل معرّف الشهادة', [Language.RUSSIAN]: 'Введите ID сертификата' },
  verify_btn: { [Language.ENGLISH]: 'Verify', [Language.URDU]: 'تصدیق کریں', [Language.ARABIC]: 'تحقق', [Language.RUSSIAN]: 'Проверить' },
  authentic_msg: { [Language.ENGLISH]: 'This certificate is authentic and verified.', [Language.URDU]: 'یہ سرٹیفکیٹ اصلی اور تصدیق شدہ ہے۔', [Language.ARABIC]: 'هذه الشهادة أصلية وموثقة.', [Language.RUSSIAN]: 'Этот сертификат подлинный и проверенный.' },
  student_name: { [Language.ENGLISH]: 'Student Name', [Language.URDU]: 'طالب علم کا نام', [Language.ARABIC]: 'اسم الطالب', [Language.RUSSIAN]: 'Имя студента' },
  course_name: { [Language.ENGLISH]: 'Course', [Language.URDU]: 'کورس', [Language.ARABIC]: 'الدورة', [Language.RUSSIAN]: 'Курс' },
  issue_date: { [Language.ENGLISH]: 'Issue Date', [Language.URDU]: 'تاریخ اجراء', [Language.ARABIC]: 'تاريخ الإصدار', [Language.RUSSIAN]: 'Дата выдачи' },
  cert_id: { [Language.ENGLISH]: 'Certificate ID', [Language.URDU]: 'سرٹیفکیٹ آئی ڈی', [Language.ARABIC]: 'معرّف الشهادة', [Language.RUSSIAN]: 'ID сертификата' },
  issued_by: { [Language.ENGLISH]: 'Issued By', [Language.URDU]: 'جاری کنندہ', [Language.ARABIC]: 'صادر عن', [Language.RUSSIAN]: 'Выдан' },
  ceo: { [Language.ENGLISH]: 'CEO', [Language.URDU]: 'سی ای او', [Language.ARABIC]: 'الرئيس التنفيذي', [Language.RUSSIAN]: 'CEO' },
  verification_status: { [Language.ENGLISH]: 'Verification Status', [Language.URDU]: 'تصدیق کی حیثیت', [Language.ARABIC]: 'حالة التحقق', [Language.RUSSIAN]: 'Статус проверки' },
  valid: { [Language.ENGLISH]: 'Valid', [Language.URDU]: 'درست', [Language.ARABIC]: 'صالح', [Language.RUSSIAN]: 'Действителен' },
  invalid_title: { [Language.ENGLISH]: 'Certificate not found', [Language.URDU]: 'سرٹیفکیٹ نہیں ملا', [Language.ARABIC]: 'الشهادة غير موجودة', [Language.RUSSIAN]: 'Сертификат не найден' },
  invalid_msg: { [Language.ENGLISH]: 'Please check the ID or contact support.', [Language.URDU]: 'براہ کرم آئی ڈی چیک کریں یا سپورٹ سے رابطہ کریں۔', [Language.ARABIC]: 'يرجى التحقق من المعرّف أو الاتصال بالدعم.', [Language.RUSSIAN]: 'Пожалуйста, проверьте ID или обратитесь в службу поддержки.' },
  revoked_title: { [Language.ENGLISH]: 'Certificate Revoked', [Language.URDU]: 'سرٹیفکیٹ منسوخ', [Language.ARABIC]: 'تم إلغاء الشهادة', [Language.RUSSIAN]: 'Сертификат аннулирован' },
  revoked_msg: { [Language.ENGLISH]: 'This credential has been revoked by the administration.', [Language.URDU]: 'یہ سند انتظامیہ کی طرف سے منسوخ کر دی گئی ہے۔', [Language.ARABIC]: 'تم إلغاء هذه الاعتماد من قبل الإدارة.', [Language.RUSSIAN]: 'Этот документ был аннулирован администрацией.' },
  blockchain_audit: { [Language.ENGLISH]: 'Blockchain Audit Trail', [Language.URDU]: 'بلاک چین آڈٹ ٹریل', [Language.ARABIC]: 'مسار تدقيق البلوكشين', [Language.RUSSIAN]: 'Аудиторский след блокчейна' },
  integrity_confirmed: { [Language.ENGLISH]: 'Integrity Confirmed', [Language.URDU]: 'سالمیت کی تصدیق', [Language.ARABIC]: 'تم تأكيد النزاهة', [Language.RUSSIAN]: 'Целостность подтверждена' },
  verifying: { [Language.ENGLISH]: 'Verifying...', [Language.URDU]: 'تصدیق ہو رہی ہے...', [Language.ARABIC]: 'جاري التحقق...', [Language.RUSSIAN]: 'Проверка...' },
};

export const CERTIFICATES_DB: CertificateData[] = [
  // ... (Existing Certificates preserved) ...
];

export const COURSES: Course[] = [
  // ... (Existing Courses preserved) ...
  {
    id: 'web-dev',
    title: 'Web Development Mastery',
    titleUr: 'ویب ڈیولپمنٹ ماسٹری',
    description: 'Learn modern web development with React, Tailwind CSS, and Node.js. Build real-world projects.',
    descriptionUr: 'React، Tailwind CSS، اور Node.js کے ساتھ جدید ویب ڈیولپمنٹ سیکھیں۔',
    category: 'Technical Skills',
    categoryUr: 'ٹیکنیکل اسکلز',
    duration: '3 Months',
    durationUr: '3 ماہ',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1000',
    price: '$299',
    rating: 4.9,
    students: 1200,
    instructor: {
      name: 'Sarkar Azeem',
      role: 'Senior Developer',
      image: 'https://ui-avatars.com/api/?name=Sarkar+Azeem&background=0D8ABC&color=fff',
      bio: 'Expert full-stack developer with 10+ years of experience.',
      quote: 'Code is poetry.'
    },
    learningOutcomes: ['HTML5, CSS3, JavaScript', 'React & Tailwind', 'Backend with Node.js', 'Deployment'],
    fullDescription: 'A complete bootcamp to take you from zero to hero in web development.'
  },
  {
    id: 'seo-mastery',
    title: 'SEO & Content Marketing',
    titleUr: 'SEO اور مواد کی مارکیٹنگ',
    description: 'Master Search Engine Optimization to rank websites on Google. Learn keyword research and backlinks.',
    descriptionUr: 'گوگل پر ویب سائٹس کو رینک کرنے کے لیے SEO میں مہارت حاصل کریں۔',
    category: 'Digital Marketing',
    categoryUr: 'ڈیجیٹل مارکیٹنگ',
    duration: '2 Months',
    durationUr: '2 ماہ',
    image: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&q=80&w=1000',
    price: '$199',
    rating: 4.8,
    students: 850,
    instructor: {
      name: 'Ali Ahmed',
      role: 'SEO Expert',
      image: 'https://ui-avatars.com/api/?name=Ali+Ahmed&background=random',
      bio: 'Ranked over 500+ websites on page 1.',
      quote: 'Content is King, Distribution is Queen.'
    },
    learningOutcomes: ['Keyword Research', 'On-Page SEO', 'Technical SEO', 'Link Building'],
    fullDescription: 'Become an SEO expert and drive organic traffic to any business.'
  },
  {
    id: 'shopify-dropshipping',
    title: 'Shopify Dropshipping',
    titleUr: 'شاپائف ڈراپ شپنگ',
    description: 'Build a profitable e-commerce store without holding inventory. Learn product hunting and ads.',
    descriptionUr: 'انوینٹری کے بغیر منافع بخش ای کامرس اسٹور بنائیں۔',
    category: 'E-Commerce',
    categoryUr: 'ای کامرس',
    duration: '6 Weeks',
    durationUr: '6 ہفتے',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1000',
    price: '$249',
    rating: 4.7,
    students: 2000,
    instructor: {
      name: 'Sarkar Azeem',
      role: 'E-Com Mentor',
      image: 'https://ui-avatars.com/api/?name=Sarkar+Azeem&background=0D8ABC&color=fff',
      bio: 'Generated 7 figures in e-commerce sales.',
      quote: 'Sell the problem, not the product.'
    },
    learningOutcomes: ['Store Setup', 'Winning Products', 'Facebook/TikTok Ads', 'Supplier Management'],
    fullDescription: 'Launch your own online store and start selling globally.'
  },
  {
    id: 'freelancing-101',
    title: 'Freelancing Success',
    titleUr: 'فری لانسنگ میں کامیابی',
    description: 'Learn how to get clients on Upwork and Fiverr. Profile optimization and proposal writing.',
    descriptionUr: 'Upwork اور Fiverr پر کلائنٹ حاصل کرنے کا طریقہ سیکھیں۔',
    category: 'Freelancing',
    categoryUr: 'فری لانسنگ',
    duration: '1 Month',
    durationUr: '1 ماہ',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
    price: '$99',
    rating: 4.9,
    students: 3000,
    instructor: {
      name: 'Zara Khan',
      role: 'Top Rated Freelancer',
      image: 'https://ui-avatars.com/api/?name=Zara+Khan&background=random',
      bio: 'Top Rated Plus on Upwork.',
      quote: 'Your network is your net worth.'
    },
    learningOutcomes: ['Profile Creation', 'Proposal Writing', 'Client Communication', 'Portfolio Building'],
    fullDescription: 'Start your freelance career with proven strategies.'
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation Agency',
    titleUr: 'AI اور آٹومیشن ایجنسی',
    description: 'Learn to use ChatGPT, Midjourney, and Zapier to automate businesses and sell services.',
    descriptionUr: 'کاروبار کو خودکار بنانے کے لیے ChatGPT اور Zapier کا استعمال سیکھیں۔',
    category: 'Technical Skills',
    categoryUr: 'ٹیکنیکل اسکلز',
    duration: '2 Months',
    durationUr: '2 ماہ',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
    price: '$349',
    rating: 5.0,
    students: 500,
    instructor: {
      name: 'Sarkar Azeem',
      role: 'AI Architect',
      image: 'https://ui-avatars.com/api/?name=Sarkar+Azeem&background=0D8ABC&color=fff',
      bio: 'Building the future with AI agents.',
      quote: 'Automate or stagnate.'
    },
    learningOutcomes: ['Prompt Engineering', 'Zapier Workflows', 'AI Chatbots', 'Content Automation'],
    fullDescription: 'Build a future-proof agency using AI tools.'
  },
  {
    id: 'soft-skills',
    title: 'Professional Soft Skills',
    titleUr: 'پیشہ ورانہ سافٹ اسکلز',
    description: 'Master communication, leadership, and emotional intelligence for career growth.',
    descriptionUr: 'کیریئر کی ترقی کے لیے مواصلات اور قیادت میں مہارت حاصل کریں۔',
    category: 'Soft Skills',
    categoryUr: 'سافٹ اسکلز',
    duration: 'Self Paced',
    durationUr: 'اپنی رفتار سے',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000',
    price: 'Free',
    rating: 4.8,
    students: 5000,
    instructor: {
      name: 'Dr. Sarah',
      role: 'Psychologist',
      image: 'https://ui-avatars.com/api/?name=Sarah&background=random',
      bio: 'Helping professionals unlock their potential.',
      quote: 'Skills get you the job, behavior keeps it.'
    },
    learningOutcomes: ['Public Speaking', 'Teamwork', 'Time Management', 'Conflict Resolution'],
    fullDescription: 'Essential skills for every professional.'
  }
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'web-development',
    title: {
      [Language.ENGLISH]: 'Website Development',
      [Language.URDU]: 'ویب سائٹ ڈویلپمنٹ',
      [Language.ARABIC]: 'تطوير المواقع',
      [Language.RUSSIAN]: 'Веб-разработка'
    },
    items: ['Responsive Landing Pages', 'E-commerce Stores', 'Custom WordPress & Shopify', 'Conversion-focused UX'],
    details: {
      tagline: {
        [Language.ENGLISH]: 'Professional websites that convert visitors into customers.',
        [Language.URDU]: 'ماہر ویب سائٹس جو زائرین کو گاہک بنائیں۔'
      },
      metaTitle: { [Language.ENGLISH]: 'Website Development Services' },
      metaDesc: { [Language.ENGLISH]: 'Build modern, responsive websites designed for speed, conversion and growth.' },
      keywords: { [Language.ENGLISH]: 'website development, responsive design, e-commerce, WordPress, Shopify' },
      benefits: [
        { title: { [Language.ENGLISH]: 'Modern Design' }, desc: { [Language.ENGLISH]: 'Clean, mobile-first websites with performance in mind.' } },
        { title: { [Language.ENGLISH]: 'Fast Deployment' }, desc: { [Language.ENGLISH]: 'Launch your site quickly with a reliable development process.' } }
      ],
      process: [
        { title: { [Language.ENGLISH]: 'Discovery' }, desc: { [Language.ENGLISH]: 'We gather requirements and goals for your business.' } },
        { title: { [Language.ENGLISH]: 'Design & Build' }, desc: { [Language.ENGLISH]: 'Design UI/UX and build the website with best practices.' } },
        { title: { [Language.ENGLISH]: 'Launch & Optimize' }, desc: { [Language.ENGLISH]: 'Go live and refine your site for traffic and conversions.' } }
      ],
      faqs: [
        { question: { [Language.ENGLISH]: 'How long does a website build take?' }, answer: { [Language.ENGLISH]: 'Most sites take 2-4 weeks depending on scope and revisions.' } },
        { question: { [Language.ENGLISH]: 'Can you integrate e-commerce?' }, answer: { [Language.ENGLISH]: 'Yes, we can build Shopify, WooCommerce, and custom online stores.' } }
      ]
    }
  },
  {
    id: 'seo-marketing',
    title: {
      [Language.ENGLISH]: 'SEO & Marketing',
      [Language.URDU]: 'SEO اور مارکیٹنگ',
      [Language.ARABIC]: 'SEO والتسويق',
      [Language.RUSSIAN]: 'SEO и маркетинг'
    },
    items: ['On-page SEO', 'Keyword Research', 'Content Strategy', 'Ranking Growth'],
    details: {
      tagline: {
        [Language.ENGLISH]: 'Grow organic traffic and search visibility with proven SEO strategies.',
        [Language.URDU]: 'مضبوط SEO حکمت عملی کے ساتھ نامیاتی ٹریفک بڑھائیں۔'
      },
      metaTitle: { [Language.ENGLISH]: 'SEO and Digital Marketing Services' },
      metaDesc: { [Language.ENGLISH]: 'Rank higher, attract customers, and build digital authority with SEO and marketing.' },
      keywords: { [Language.ENGLISH]: 'seo services, keyword research, content marketing, digital growth' },
      benefits: [
        { title: { [Language.ENGLISH]: 'Search Visibility' }, desc: { [Language.ENGLISH]: 'Improve rankings for search terms that matter to your business.' } },
        { title: { [Language.ENGLISH]: 'Content Growth' }, desc: { [Language.ENGLISH]: 'Publish optimized content that brings consistent leads.' } }
      ],
      process: [
        { title: { [Language.ENGLISH]: 'Audit' }, desc: { [Language.ENGLISH]: 'Review your current website and search performance.' } },
        { title: { [Language.ENGLISH]: 'Strategy' }, desc: { [Language.ENGLISH]: 'Create a roadmap for content, backlinks, and technical SEO.' } },
        { title: { [Language.ENGLISH]: 'Execution' }, desc: { [Language.ENGLISH]: 'Implement improvements and monitor ranking progress.' } }
      ],
      faqs: [
        { question: { [Language.ENGLISH]: 'Will SEO work for my business?' }, answer: { [Language.ENGLISH]: 'Yes, if your website has a clear message and consistent optimization.' } },
        { question: { [Language.ENGLISH]: 'Do you provide monthly reporting?' }, answer: { [Language.ENGLISH]: 'Yes, monthly reports are included with all SEO packages.' } }
      ]
    }
  },
  {
    id: 'digital-ads',
    title: {
      [Language.ENGLISH]: 'Digital Ads',
      [Language.URDU]: 'ڈیجیٹل اشتہارات',
      [Language.ARABIC]: 'إعلانات رقمية',
      [Language.RUSSIAN]: 'Цифровая реклама'
    },
    items: ['Google Ads', 'Facebook Ads', 'TikTok Campaigns', 'Conversion Tracking'],
    details: {
      tagline: { [Language.ENGLISH]: 'Reach the right audience with targeted paid campaigns.' },
      metaTitle: { [Language.ENGLISH]: 'Digital Advertising Services' },
      metaDesc: { [Language.ENGLISH]: 'Drive leads and conversions with high-performing ad campaigns across top platforms.' },
      keywords: { [Language.ENGLISH]: 'google ads, facebook ads, tiktok ads, paid media' },
      benefits: [
        { title: { [Language.ENGLISH]: 'Targeted Reach' }, desc: { [Language.ENGLISH]: 'Show ads to customers based on intent and behavior.' } },
        { title: { [Language.ENGLISH]: 'Campaign Optimization' }, desc: { [Language.ENGLISH]: 'Improve performance through data-driven adjustments.' } }
      ],
      process: [
        { title: { [Language.ENGLISH]: 'Campaign Setup' }, desc: { [Language.ENGLISH]: 'Create audiences, creatives, and tracking for your ads.' } },
        { title: { [Language.ENGLISH]: 'Launch' }, desc: { [Language.ENGLISH]: 'Activate campaigns across Google, Facebook, and TikTok.' } },
        { title: { [Language.ENGLISH]: 'Optimize' }, desc: { [Language.ENGLISH]: 'Refine bids, creatives, and audience targeting to improve ROI.' } }
      ],
      faqs: [
        { question: { [Language.ENGLISH]: 'Can you manage budgets in PKR or USD?' }, answer: { [Language.ENGLISH]: 'Yes, campaigns can be managed in either currency to match your budget.' } },
        { question: { [Language.ENGLISH]: 'How long until ads start generating leads?' }, answer: { [Language.ENGLISH]: 'Most campaigns begin generating measurable lead activity within 1-2 weeks.' } }
      ]
    }
  },
  {
    id: 'ai-automation',
    title: {
      [Language.ENGLISH]: 'AI Automation',
      [Language.URDU]: 'AI آٹومیشن',
      [Language.ARABIC]: 'أتمتة الذكاء الاصطناعي',
      [Language.RUSSIAN]: 'Автоматизация ИИ'
    },
    items: ['Chatbots', 'Workflows', 'CRM Automation', 'Support Bots'],
    details: {
      tagline: {
        [Language.ENGLISH]: 'Automate business tasks with AI workflows and smart assistants.',
        [Language.URDU]: 'AI ورک فلو اور اسسٹنٹس سے کاروباری کام خودکار بنائیں۔'
      },
      metaTitle: { [Language.ENGLISH]: 'AI Automation Services' },
      metaDesc: { [Language.ENGLISH]: 'Implement intelligent automation to save time and reduce manual work.' },
      keywords: { [Language.ENGLISH]: 'ai automation, chatbots, workflow automation, ai assistants' },
      benefits: [
        { title: { [Language.ENGLISH]: 'Smart Workflows' }, desc: { [Language.ENGLISH]: 'Connect tools and automate repetitive tasks.' } },
        { title: { [Language.ENGLISH]: 'Faster Support' }, desc: { [Language.ENGLISH]: 'Use AI chatbots to answer customer questions instantly.' } }
      ],
      process: [
        { title: { [Language.ENGLISH]: 'Assessment' }, desc: { [Language.ENGLISH]: 'Identify repetitive processes and automation opportunities.' } },
        { title: { [Language.ENGLISH]: 'Build' }, desc: { [Language.ENGLISH]: 'Create AI flows that handle customer and business tasks.' } },
        { title: { [Language.ENGLISH]: 'Track' }, desc: { [Language.ENGLISH]: 'Monitor performance and improve automation continuously.' } }
      ],
      faqs: [
        { question: { [Language.ENGLISH]: 'Can AI work with my existing tools?' }, answer: { [Language.ENGLISH]: 'Yes, we can integrate workflows with your current apps and CRM.' } },
        { question: { [Language.ENGLISH]: 'Will automation save time?' }, answer: { [Language.ENGLISH]: 'Yes, automation reduces manual work and improves response speed.' } }
      ]
    }
  },
  {
    id: 'brand-growth',
    title: {
      [Language.ENGLISH]: 'Brand Growth',
      [Language.URDU]: 'برانڈ گروتھ',
      [Language.ARABIC]: 'نمو العلامة التجارية',
      [Language.RUSSIAN]: 'Рост бренда'
    },
    items: ['Social Media Strategy', 'Brand Messaging', 'Reputation Building', 'Creative Campaigns'],
    details: {
      tagline: { [Language.ENGLISH]: 'Build recognition and trust with a strong digital brand presence.' },
      metaTitle: { [Language.ENGLISH]: 'Brand Growth Services' },
      metaDesc: { [Language.ENGLISH]: 'Grow your digital brand through smart content, messaging, and partnerships.' },
      keywords: { [Language.ENGLISH]: 'brand growth, social media strategy, reputation, creative campaigns' },
      benefits: [
        { title: { [Language.ENGLISH]: 'Brand Authority' }, desc: { [Language.ENGLISH]: 'Create a consistent voice that customers trust.' } },
        { title: { [Language.ENGLISH]: 'Higher Engagement' }, desc: { [Language.ENGLISH]: 'Drive more attention across social and digital channels.' } }
      ],
      process: [
        { title: { [Language.ENGLISH]: 'Strategy' }, desc: { [Language.ENGLISH]: 'Define your brand position, tone, and audience.' } },
        { title: { [Language.ENGLISH]: 'Content' }, desc: { [Language.ENGLISH]: 'Produce campaigns that engage and convert.' } },
        { title: { [Language.ENGLISH]: 'Growth' }, desc: { [Language.ENGLISH]: 'Scale messaging across platforms and partners.' } }
      ],
      faqs: [
        { question: { [Language.ENGLISH]: 'Can you improve social media engagement?' }, answer: { [Language.ENGLISH]: 'Yes, we develop campaigns focused on audience growth and loyalty.' } },
        { question: { [Language.ENGLISH]: 'Do you support brand refreshes?' }, answer: { [Language.ENGLISH]: 'Yes, we can refresh your visual identity, messaging, and positioning.' } }
      ]
    }
  }
];

export const STUDENT_PLANS = [
  // ... (Existing Plans preserved) ...
];

export const PRICING_PACKAGES = [
   { id: 'basic', name: { [Language.ENGLISH]: 'Basic', [Language.URDU]: 'بنیادی' }, price: { USD: { monthly: 499, onetime: 1500 }, PKR: { monthly: 140000, onetime: 420000 } }, features: { [Language.ENGLISH]: ['Basic Web Dev', 'Basic SEO'], [Language.URDU]: ['بنیادی ویب ڈیولپمنٹ', 'بنیادی SEO'] }, buttonKey: 'svc_req_btn' },
   { id: 'business', name: { [Language.ENGLISH]: 'Business', [Language.URDU]: 'کاروبار' }, price: { USD: { monthly: 999, onetime: 3000 }, PKR: { monthly: 280000, onetime: 840000 } }, features: { [Language.ENGLISH]: ['Advanced Web Dev', 'Full SEO', 'Social Media'], [Language.URDU]: ['ایڈوانسڈ ویب ڈیولپمنٹ', 'مکمل SEO', 'سوشل میڈیا'] }, popular: true, buttonKey: 'svc_req_btn' },
   { id: 'custom', name: { [Language.ENGLISH]: 'Custom', [Language.URDU]: 'حسب ضرورت' }, price: 'custom', features: { [Language.ENGLISH]: ['Tailored Solutions', 'Dedicated Manager'], [Language.URDU]: ['اپنی مرضی کے مطابق حل', 'مختص مینیجر'] }, buttonKey: 'svc_expert_btn' }
];

export const CLIENT_PROPOSALS = {
  footer: 'Regards, Digital Solutions Hub',
  web_dev: { title: 'Web Development Proposal', subject: 'Proposal for Website', content: 'Dear Client,\n\nWe propose to build a high-quality website...' },
  seo: { title: 'SEO Proposal', subject: 'Proposal for SEO Services', content: 'Dear Client,\n\nWe propose to optimize your website...' }
};

export const SYLLABUS_CURRICULUM = [
  { 
    id: 'foundation', 
    level: 'Foundation', 
    bg: 'bg-slate-900', 
    border: 'border-slate-800', 
    color: 'text-white', 
    modules: [
      { id: 'm1', title: 'Module 1: Digital Mindset', topics: ['Growth Mindset', 'Freelancing Economy', 'Goal Setting'] },
      { id: 'm2', title: 'Module 2: Tools of Trade', topics: ['Google Workspace', 'Slack/Discord', 'Trello/Notion'] }
    ] 
  },
  {
    id: 'professional',
    level: 'Professional',
    bg: 'bg-blue-900',
    border: 'border-blue-800',
    color: 'text-blue-100',
    modules: [
      { id: 'm3', title: 'Module 3: Skill Mastery', topics: ['Core Technical Skills', 'Project Management', 'Client Handling'] },
      { id: 'm4', title: 'Module 4: Portfolio', topics: ['Building Case Studies', 'Personal Branding', 'Social Proof'] }
    ]
  },
  {
    id: 'expert',
    level: 'Expert',
    bg: 'bg-purple-900',
    border: 'border-purple-800',
    color: 'text-purple-100',
    modules: [
      { id: 'm5', title: 'Module 5: Scaling', topics: ['Agency Model', 'Outsourcing', 'Automation'] },
      { id: 'm6', title: 'Module 6: Leadership', topics: ['Team Management', 'Financial Planning', 'Global Expansion'] }
    ]
  }
];

export const SOFT_SKILLS_MODULE = {
  title: 'Complete Soft Skills Library',
  skills: [
    'Communication Skills', 'Public Speaking', 'Leadership', 'Time Management', 
    'Teamwork', 'Emotional Intelligence', 'Problem Solving', 'Critical Thinking', 
    'Confidence Building', 'Freelancing Ethics', 'Client Communication', 
    'Interview Skills', 'Work Discipline', 'Negotiation', 'Professional Behavior',
    'Adaptability', 'Stress Management', 'Decision Making'
  ]
};

export const STUDENT_ANNOUNCEMENTS = [
  { id: 1, type: 'Release', title: 'Certificates Released for Batch 24', date: 'Oct 25, 2024', message: 'Certificates for Freelancing & Online Earning batch 24 have been issued. Check your Certificates tab.' },
  { id: 2, type: 'Alert', title: 'New Course Added: AI Automation', date: 'Oct 22, 2024', message: 'Enroll now in our advanced AI Automation course to learn Zapier and ChatGPT workflows.' },
  { id: 3, type: 'Update', title: 'Shopify Module Updated', date: 'Oct 20, 2024', message: 'New lessons on TikTok Ads integration have been added to the Shopify Mastery course.' }
];

export const ADD_ON_COURSES = [];
export const STUDENT_BONUSES = [];
export const PAYMENT_METHODS = [];
export const PAYMENT_TERMS = [];
