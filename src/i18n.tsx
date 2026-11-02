import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'ar' | 'en'

export const PHONE = '01202943443'
export const WA = '201202943443'
export const EMAIL = 'abdoangel218@gmail.com'
export const FB = 'https://www.facebook.com/profile.php?id=61595974857683'

const dict = {
  ar: {
    skip: 'تخطَّ إلى المحتوى',
    nav: { start: 'ابدأ مشروعك', services: 'الخدمات', process: 'مراحل العمل', work: 'أعمالنا', about: 'من نحن', contact: 'تواصل', faq: 'أسئلة' },
    wa: 'واتساب',
    switch: 'English',
    hero: {
      title: 'شقتك تستحق تشطيب يليق بيها',
      sub: 'نبدأ معك من التصميم والتخطيط، ونكمل كل مراحل التنفيذ حتى تستلم بيتك جاهزًا.',
      cta: 'ابدأ مشروعك',
      cta2: 'شاهد أعمالنا',
      scroll: 'اسحب للأسفل',
      plan: 'المخطط',
      home: 'البيت',
    },
    services: {
      title: 'من الفكرة إلى المفتاح',
      lead: 'نتولى المشروع كاملًا، فلا تحتاج للتنسيق بين أكثر من جهة.',
      items: [
        { t: 'التصميم الداخلي', d: 'توزيع الفراغات والأثاث، واختيار الألوان والخامات بما يناسب حياتك اليومية.' },
        { t: 'التشطيب الكامل', d: 'تشطيب الشقق السكنية من الأعمال الأولى حتى اللمسات الأخيرة.' },
        { t: 'التنفيذ والإشراف', d: 'مهندسة تتابع الموقع في كل مرحلة وتلتزم بالمخطط والموعد.' },
        { t: 'الإضاءة والخامات', d: 'إضاءة مدروسة وخامات مختارة بعناية توازن بين الجمال وسهولة الاستخدام.' },
      ],
    },
    process: {
      title: 'كيف نعمل معك',
      steps: [
        { t: 'نسمعك أولًا', d: 'معاينة الشقة ومعرفة احتياجاتك وميزانيتك.' },
        { t: 'نخطط', d: 'مخطط توزيع واضح تراجعه معنا قبل أي خطوة.' },
        { t: 'نصمم', d: 'اختيار الألوان والخامات والإضاءة وتصور الشكل النهائي.' },
        { t: 'ننفذ', d: 'تنفيذ بإشراف مباشر ومتابعة مستمرة لك.' },
        { t: 'نسلم', d: 'تستلم بيتك جاهزًا للسكن.' },
      ],
    },
    work: {
      title: 'أعمالنا',
      lead: 'نماذج من أسلوبنا. صور المشاريع الفعلية تُضاف قريبًا.',
      all: 'الكل',
      cats: { living: 'غرف المعيشة', bed: 'غرف النوم', kitchen: 'المطابخ', bath: 'الحمامات' },
      open: 'عرض المشروع',
      close: 'إغلاق',
      ask: 'اطلب تصميمًا مشابهًا',
      names: ['معيشة دافئة', 'غرفة نوم هادئة', 'مطبخ عملي', 'حمام فندقي', 'ريسبشن مفتوح', 'غرفة ماستر'],
      desc: 'مثال على أسلوبنا في توزيع المساحة والإضاءة والخامات. سيتم استبداله بصور المشروع الحقيقية.',
    },
    about: {
      title: 'مهندسة معمارية، وبيتك أولويتها',
      p1: 'أعمل على تصميم المساحات السكنية وتنفيذها والإشراف على مراحل التنفيذ، مع اهتمام خاص بتوزيع الأثاث واختيار الخامات والألوان والإضاءة.',
      p2: 'الهدف دائمًا أن يجمع البيت بين الجمال والوظيفة، ويلبي احتياجاتك أنت.',
      tag: 'مساحات مبتكرة لغدٍ أفضل',
    },
    contact: {
      title: 'احكي لنا عن شقتك',
      lead: 'اكتب التفاصيل وسنفتح لك محادثة واتساب جاهزة.',
      name: 'الاسم',
      service: 'نوع الخدمة',
      services: ['تصميم داخلي', 'تشطيب كامل', 'تنفيذ وإشراف', 'لا أعرف بعد'],
      msg: 'تفاصيل المشروع',
      msgPh: 'المساحة، الموقع، وما تحتاجه',
      send: 'أرسل على واتساب',
      address: 'شرم الشيخ، حي النور، الإسكان المتميز، عقار 19، شقة 10',
      hours: 'متاحون دائمًا',
      msgPre: 'مرحبًا AA Vision، أنا',
    },
    slides: [
      { t: 'غرف معيشة تشبه أسلوب حياتك', c: 'تصميم داخلي' },
      { t: 'غرف نوم تمنحك الهدوء', c: 'غرف النوم' },
      { t: 'مطابخ جميلة وسهلة الاستخدام', c: 'المطابخ' },
    ],
    concept: 'صور توضيحية للتصور وليست مشاريع منفذة',
    stats: {
      title: 'التزامنا في ثلاث نقاط',
      items: [
        { v: 5, s: '', l: 'مراحل واضحة من الفكرة إلى التسليم' },
        { v: 100, s: '%', l: 'إشراف مباشر من المهندسة على التنفيذ' },
        { v: 7, s: '/7', l: 'متاحون دائمًا للرد على استفساراتك' },
      ],
    },
    ba: {
      title: 'الفرق قبل وبعد',
      lead: 'حرّك الشريط لترى كيف تتحول مساحة خام إلى بيت جاهز.',
      before: 'قبل',
      after: 'بعد',
      aria: 'شريط المقارنة بين قبل وبعد',
    },
    reviews: { title: 'آراء العملاء', items: [] as { q: string; n: string; p: string }[] },
    faq: {
      title: 'أسئلة شائعة',
      items: [
        { q: 'هل تتولون المشروع من التصميم حتى التسليم؟', a: 'نعم. نبدأ بالتصميم والتخطيط ثم نكمل التنفيذ والإشراف حتى تستلم بيتك جاهزًا.' },
        { q: 'من يتابع التنفيذ في الموقع؟', a: 'مهندسة معمارية تشرف على كل مرحلة وتتابع الالتزام بالمخطط.' },
        { q: 'كيف أبدأ؟', a: 'راسلنا على واتساب بتفاصيل الشقة ومساحتها وما تحتاجه، وسنرد عليك لتحديد موعد المعاينة.' },
        { q: 'هل أستطيع اختيار الخامات والألوان؟', a: 'بالتأكيد. نعرض عليك الخيارات ونرشح الأنسب لاستخدامك وميزانيتك، والقرار لك.' },
        { q: 'في أي منطقة تعملون؟', a: 'نعمل في شرم الشيخ. للمناطق الأخرى راسلنا وسنخبرك.' },
      ],
    },
    menu: 'القائمة',
    theme: { dark: 'تفعيل الوضع الداكن', light: 'تفعيل الوضع الفاتح' },
    view: 'عرض',
    loader: 'جارٍ تجهيز المساحة',
    waw: {
      status: 'متاحون دائمًا',
      hello: 'أهلًا بك في AA Vision. كيف نقدر نساعدك في شقتك؟',
      quick: ['أريد تشطيب شقة', 'أريد تصميمًا داخليًا', 'أريد حجز معاينة', 'أسأل عن التكلفة'],
      ph: 'اكتب رسالتك',
      send: 'إرسال على واتساب',
      open: 'افتح محادثة واتساب',
      tip: 'تحتاج مساعدة؟ راسلنا',
      close: 'إغلاق المحادثة',
    },
    waFloat: 'تواصل معنا على واتساب',
    prev: 'السابق',
    next: 'التالي',
    footer: 'جميع الحقوق محفوظة',
  },
  en: {
    skip: 'Skip to content',
    nav: { start: 'Start a project', services: 'Services', process: 'Process', work: 'Work', about: 'About', contact: 'Contact', faq: 'FAQ' },
    wa: 'WhatsApp',
    switch: 'العربية',
    hero: {
      title: 'Your apartment deserves a finish that fits you',
      sub: 'We start with design and planning, then stay through every stage of execution until you receive a home that is ready to live in.',
      cta: 'Start your project',
      cta2: 'See our work',
      scroll: 'Scroll',
      plan: 'Plan',
      home: 'Home',
    },
    services: {
      title: 'From idea to keys',
      lead: 'We handle the whole project, so you never coordinate between several parties.',
      items: [
        { t: 'Interior design', d: 'Space and furniture layout, with colours and materials that suit how you live.' },
        { t: 'Full finishing', d: 'Residential finishing from the first works to the last touches.' },
        { t: 'Execution & supervision', d: 'An architect visits the site at every stage and holds to the plan and the date.' },
        { t: 'Lighting & materials', d: 'Considered lighting and carefully chosen materials that balance beauty and ease of use.' },
      ],
    },
    process: {
      title: 'How we work with you',
      steps: [
        { t: 'We listen first', d: 'We visit the apartment and learn your needs and budget.' },
        { t: 'We plan', d: 'A clear layout you review with us before anything starts.' },
        { t: 'We design', d: 'Colours, materials and lighting, with a picture of the final result.' },
        { t: 'We build', d: 'Execution under direct supervision, with regular updates to you.' },
        { t: 'We hand over', d: 'You receive a home ready to move into.' },
      ],
    },
    work: {
      title: 'Our work',
      lead: 'Samples of our approach. Photos of real projects are coming soon.',
      all: 'All',
      cats: { living: 'Living rooms', bed: 'Bedrooms', kitchen: 'Kitchens', bath: 'Bathrooms' },
      open: 'View project',
      close: 'Close',
      ask: 'Ask for a similar design',
      names: ['Warm living room', 'Calm bedroom', 'Practical kitchen', 'Hotel-style bath', 'Open reception', 'Master suite'],
      desc: 'An example of how we handle layout, light and materials. It will be replaced by photos of the real project.',
    },
    about: {
      title: 'An architect who puts your home first',
      p1: 'I design residential spaces, build them and supervise every stage, with particular care for furniture layout and the choice of materials, colours and lighting.',
      p2: 'The aim is always a home that joins beauty and function and answers your needs.',
      tag: 'Innovative spaces for a better tomorrow',
    },
    contact: {
      title: 'Tell us about your apartment',
      lead: 'Write the details and we open a ready WhatsApp chat for you.',
      name: 'Name',
      service: 'Service',
      services: ['Interior design', 'Full finishing', 'Execution & supervision', 'Not sure yet'],
      msg: 'Project details',
      msgPh: 'Size, location and what you need',
      send: 'Send on WhatsApp',
      address: 'Sharm el-Sheikh, Hay El-Nour, Al-Iskan Al-Motamayez, Building 19, Apt 10',
      hours: 'Always open',
      msgPre: 'Hello AA Vision, I am',
    },
    slides: [
      { t: 'Living rooms that fit the way you live', c: 'Interior design' },
      { t: 'Bedrooms that give you calm', c: 'Bedrooms' },
      { t: 'Kitchens that look good and work well', c: 'Kitchens' },
    ],
    concept: 'Concept visuals, not completed projects',
    stats: {
      title: 'Our commitment in three points',
      items: [
        { v: 5, s: '', l: 'Clear stages from idea to handover' },
        { v: 100, s: '%', l: 'Direct supervision by the architect during execution' },
        { v: 7, s: '/7', l: 'Always available to answer your questions' },
      ],
    },
    ba: {
      title: 'Before and after',
      lead: 'Drag the handle to see a raw space become a finished home.',
      before: 'Before',
      after: 'After',
      aria: 'Before and after comparison slider',
    },
    reviews: { title: 'Client reviews', items: [] as { q: string; n: string; p: string }[] },
    faq: {
      title: 'Common questions',
      items: [
        { q: 'Do you handle the project from design to handover?', a: 'Yes. We start with design and planning, then continue with execution and supervision until you receive a ready home.' },
        { q: 'Who follows the work on site?', a: 'An architect supervises every stage and checks that the plan is followed.' },
        { q: 'How do I start?', a: 'Message us on WhatsApp with the apartment details, its size and what you need, and we will reply to set a site visit.' },
        { q: 'Can I choose materials and colours?', a: 'Of course. We show you the options and recommend what fits your use and budget. The decision is yours.' },
        { q: 'Which areas do you work in?', a: 'We work in Sharm el-Sheikh. For other areas, message us and we will tell you.' },
      ],
    },
    menu: 'Menu',
    theme: { dark: 'Switch to dark mode', light: 'Switch to light mode' },
    view: 'View',
    loader: 'Preparing the space',
    waw: {
      status: 'Always available',
      hello: 'Welcome to AA Vision. How can we help with your apartment?',
      quick: ['I need apartment finishing', 'I need interior design', 'Book a site visit', 'Ask about cost'],
      ph: 'Type your message',
      send: 'Send on WhatsApp',
      open: 'Open WhatsApp chat',
      tip: 'Need help? Message us',
      close: 'Close chat',
    },
    waFloat: 'Chat with us on WhatsApp',
    prev: 'Previous',
    next: 'Next',
    footer: 'All rights reserved',
  },
}

export type Dict = (typeof dict)['ar']

const Ctx = createContext<{ lang: Lang; t: Dict; toggle: () => void }>(null as never)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem('lang') as Lang) || 'ar'
    } catch {
      return 'ar'
    }
  })
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = lang === 'ar' ? 'AA Vision | تصميم داخلي وتشطيب في شرم الشيخ' : 'AA Vision | Interior design & finishing in Sharm el-Sheikh'
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])
  return <Ctx.Provider value={{ lang, t: dict[lang] as Dict, toggle: () => setLang(lang === 'ar' ? 'en' : 'ar') }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
