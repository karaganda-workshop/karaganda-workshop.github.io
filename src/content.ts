/** Public file URL; prefixes Vite's BASE_URL (`/` locally, `/workshop-karaganda/` on Pages). */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export const WHATSAPP = "https://wa.me/77026527347";

export const navLinks = [
  { href: "#speakers", label: "Спикеры" },
  { href: "#price", label: "Стоимость" },
];

export const facts = [
  { question: "Когда?", answer: "26 ноября, в 18:30", icon: "calendar" },
  { question: "Где?", answer: "Назарбаева 37", icon: "pin" },
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
  { text: "Будете знать всё про налогообложение в 2026 году", icon: "calculator" },
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
  unit: "тенге с человека",
  note: "Один билет на воркшоп. Бонусы уже входят в эту сумму.",
  included: [
    "Воркшоп: реклама, автоматизация, налоги",
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

export const partners = [
  { src: asset("/partners/karaganda.png"), alt: "Караганда", size: "h-20 sm:h-32" },
  {
    src: asset("/partners/legal.png"),
    alt: "Палата юридических консультантов",
    size: "h-12 sm:h-24",
  },
];
