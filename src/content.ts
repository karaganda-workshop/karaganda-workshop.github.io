/** Public file URL; prefixes Vite's BASE_URL (`/` locally, `/workshop-karaganda/` on Pages). */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

const DEFAULT_WHATSAPP = "https://wa.me/77026527347";

/**
 * Booking link. Overridable via VITE_WHATSAPP_URL, but only with a plain
 * https://wa.me/<digits> link — anything else (typo, javascript:, another
 * host) falls back to the default so a bad value can't hijack every CTA.
 */
function whatsappUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return DEFAULT_WHATSAPP;
  return /^https:\/\/wa\.me\/\d{6,15}(\?text=[\w%.\-+]*)?$/.test(value) ? value : DEFAULT_WHATSAPP;
}

export const WHATSAPP = whatsappUrl(import.meta.env.VITE_WHATSAPP_URL);

export const navLinks = [
  { href: "#speakers", label: "Спикеры" },
  { href: "#price", label: "Стоимость" },
];

export const facts = [
  { question: "Когда?", answer: "26 ноября, в 18:30", icon: "calendar" },
  { question: "Где?", answer: "Назарбаева 37, офис 111", icon: "pin" },
  { question: "Сколько длится?", answer: "1 час", icon: "clock" },
  {
    question: "О чем говорим?",
    answer: "маркетинг, автоматизация, налогообложение",
    icon: "layers",
  },
] as const;

export const results = [
  { text: "Поймёте, как правильно работать с рекламой", icon: "target" },
  { text: "Научитесь автоматизировать обработку заявок", icon: "gears" },
  {
    text: "Получите ясность в налогах и порядок в документах к закрытию отчётного года",
    icon: "calculator",
  },
] as const;

export const tools = [
  {
    title: "Маркетинг",
    icon: "target",
    note: "Как запустить рекламу в 10 раз быстрее и проще, не привлекая сторонних специалистов.",
    groups: [
      { label: "Автоматизация маркетинга", items: ["GPT", "Claude Cowork"] },
      { label: "Рекламные кабинеты", items: ["Meta Ads", "Google Ads"] },
      { label: "Аналитика", items: ["Google Analytics", "Яндекс Метрика"] },
    ],
  },
  {
    title: "Применение ИИ",
    icon: "gears",
    note: "Увеличиваем поток и скорость обработки входящих заявок, убирая ручную работу.",
    groups: [
      { label: "Автоматизация заявок", items: ["NextBot", "WhatsApp", "Instagram"] },
      { label: "CRM", items: ["AmoCRM", "Bitrix24"] },
    ],
  },
  {
    title: "Финансы",
    icon: "calculator",
    note: "Спокойно сдаём отчётность в конце года и наводим порядок в финансах.",
    groups: [
      {
        label: "Порядок в деньгах",
        items: ["Автоматизация финансов", "Ясность в налогах", "Документы к закрытию года"],
      },
    ],
  },
] as const;

export const afterSeminar = [
  "Поймёте, как запускать рекламу в Meta и Google самостоятельно, не привлекая подрядчика и не сливая бюджет.",
  "Научитесь отслеживать, из какого канала приходят клиенты, и считать стоимость заявки.",
  "Увидите, как автоматизировать обработку заявок из WhatsApp и Instagram через ботов и CRM.",
  "Узнаете, какие задачи бизнеса уже можно поручить нейросетям, а где они пока не помогут.",
  "Получите ясность в налогах и поймёте, как спокойно подойти к закрытию отчётного года.",
  "Наведёте порядок в документах и финансах, чтобы не терять деньги на штрафах и хаосе.",
] as const;

export interface Speaker {
  name: string;
  role: string;
  topic: string;
  photo: string;
}

export const speakers: Speaker[] = [
  {
    name: "Жасулан Алимбаев",
    topic: "Реклама",
    role: "Маркетолог, 5 лет опыта, работал с бюджетами от 10 млн тенге в месяц, специализируется на рекламных кабинетах и работе с блогерами.",
    photo: asset("/speakers/zhasulan.jpg"),
  },
  {
    name: "Сергей Чиняев",
    topic: "Автоматизация",
    role: "Специалист по автоматизации обработки заявок. Разбирает NextBot, WhatsApp, Direct и CRM: amoCRM и Битрикс24.",
    photo: asset("/speakers/sergey.jpg"),
  },
  {
    name: "Оксана Згардан",
    topic: "Налоги и учёт",
    role: "Бухгалтер, 5 лет стажа, высшее экономическое образование, диплом ACCA DipIFR. Обучение финансов и бухгалтерии на реальных рабочих задачах.",
    photo: asset("/speakers/oksana-portrait.jpg"),
  },
];

export const price = {
  amount: "15\u00a0000",
  unit: "с человека",
  note: "Один билет на бизнес-семинар. Бонусы уже входят в эту сумму.",
  included: [
    "Бизнес-семинар: реклама, автоматизация, налоги",
    "Персональная консультация после лекции",
    "Материалы в Telegram-боте",
  ],
};

export const bonuses = [
  {
    icon: "consult",
    label: "Отдельно от лекции",
    title: "Персональная консультация",
    text: "После лекции можно разобрать вашу ситуацию лично: рекламу, заявки или финансы. Не общий разбор, а ваш бизнес.",
  },
  {
    icon: "docs",
    label: "После семинара",
    title: "Материалы в Telegram",
    text: "После семинара вы получите дополнительные материалы в Telegram-боте.",
  },
] as const;

export interface Partner {
  src: string;
  alt: string;
  size: string;
  /** Shown next to the logo when the logo itself carries no name. */
  caption?: { kind: string; name: string };
}

export const partners: Partner[] = [
  {
    src: asset("/partners/karaganda.png"),
    alt: "ОЮЛ и ИП «Казахстанская ассоциация преподавателей и сервисных услуг»",
    size: "h-16 sm:h-28",
    caption: {
      kind: "ОЮЛ и ИП",
      name: "«Казахстанская ассоциация преподавателей и сервисных услуг»",
    },
  },
  {
    src: asset("/partners/legal.png"),
    alt: "Палата юридических консультантов",
    size: "h-12 sm:h-24",
  },
];
