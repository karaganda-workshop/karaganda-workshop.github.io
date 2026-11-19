<script setup lang="ts">
/**
 * Interactive lead magnet with two scenarios the visitor can switch between,
 * each a pair of auto-playing chats launched by one button:
 *  - "leads": one client is served by a human manager (slow) and by the AI
 *    (fast and far more thorough);
 *  - "creative": approving an ad creative with marketer Руслан (slow) vs the
 *    AI assembling it in a quick dialogue.
 * Pure client-side; it shows the value of AI before the CTA.
 */
import { computed, onUnmounted, reactive, ref } from "vue";
import BookLink from "@/components/BookLink.vue";
import ChatThread from "@/components/ChatThread.vue";
import TextAnimate from "@/components/ui/TextAnimate.vue";

type Mode = "leads" | "creative";
const mode = ref<Mode>("leads");

const seconds = (ms: number): string => (ms / 1000).toFixed(1).replace(".", ",");

function makeTimer(target: { value: number }) {
  let id: number | undefined;
  return {
    start() {
      if (id) return;
      const base = performance.now() - target.value;
      id = window.setInterval(() => {
        target.value = performance.now() - base;
      }, 80);
    },
    stop() {
      if (id) {
        clearInterval(id);
        id = undefined;
      }
    },
  };
}

interface Step {
  side: "in" | "out";
  name?: string;
  text: string;
  typeMs: number;
}

function makePlayer(script: Step[]) {
  const shown = ref<Step[]>([]);
  const typing = ref<{ side: "in" | "out"; name?: string } | null>(null);
  const ms = ref(0);
  const running = ref(false);
  const timer = makeTimer(ms);
  let to: number | undefined;
  const done = computed(() => shown.value.length >= script.length && !running.value);

  function play(i: number): void {
    if (i >= script.length) {
      typing.value = null;
      timer.stop();
      running.value = false;
      return;
    }
    const step = script[i];
    typing.value = { side: step.side, name: step.name };
    to = window.setTimeout(() => {
      typing.value = null;
      shown.value = [...shown.value, step];
      play(i + 1);
    }, step.typeMs);
  }

  function start(): void {
    if (to) clearTimeout(to);
    shown.value = [];
    ms.value = 0;
    typing.value = null;
    running.value = true;
    timer.start();
    play(0);
  }

  function stop(): void {
    if (to) clearTimeout(to);
    timer.stop();
  }

  return reactive({ shown, typing, ms, running, done, start, stop });
}

// ---- Scenario 1: one client, served by a manager vs the AI ----
const CLIENT = "Айгерим";
const T_CLIENT = 2200;
const T_HUMAN = 4300;
const T_AI = 1500;

const leadsHuman = makePlayer([
  { side: "in", name: CLIENT, text: "Здравствуйте! Сколько стоит?", typeMs: T_CLIENT },
  { side: "out", text: "Здравствуйте, 15 000 ₸", typeMs: T_HUMAN },
  { side: "in", name: CLIENT, text: "Доставка по Караганде есть?", typeMs: T_CLIENT },
  { side: "out", text: "Да, есть", typeMs: T_HUMAN },
  { side: "in", name: CLIENT, text: "А можно в рассрочку?", typeMs: T_CLIENT },
  { side: "out", text: "Сейчас уточню у руководителя, отвечу позже", typeMs: T_HUMAN + 600 },
  { side: "in", name: CLIENT, text: "Оплатить картой можно?", typeMs: T_CLIENT },
  { side: "out", text: "Да, можно картой", typeMs: T_HUMAN },
]);

const leadsAi = makePlayer([
  { side: "in", name: CLIENT, text: "Здравствуйте! Сколько стоит?", typeMs: T_CLIENT },
  {
    side: "out",
    text: "Здравствуйте, Айгерим! Спасибо, что написали 🙌 Участие стоит 15 000 ₸ — в цену уже входят материалы и консультация после. Оформить вам заявку прямо сейчас?",
    typeMs: T_AI,
  },
  { side: "in", name: CLIENT, text: "Доставка по Караганде есть?", typeMs: T_CLIENT },
  {
    side: "out",
    text: "Да, конечно! По Караганде доставляем за 1–2 дня, курьером до двери. Подскажите район — скажу точное время и рассчитаю доставку.",
    typeMs: T_AI,
  },
  { side: "in", name: CLIENT, text: "А можно в рассрочку?", typeMs: T_CLIENT },
  {
    side: "out",
    text: "Да, есть рассрочка на 3 месяца без переплаты через Kaspi — это примерно 5 000 ₸ в месяц. Хотите, подскажу, как оформить за пару минут?",
    typeMs: T_AI,
  },
  { side: "in", name: CLIENT, text: "Оплатить картой можно?", typeMs: T_CLIENT },
  {
    side: "out",
    text: "Конечно — принимаем картой, наличными и через Kaspi QR, как вам удобнее, всё с чеком. Давайте оформлю заказ и забронирую за вами?",
    typeMs: T_AI,
  },
]);

// ---- Scenario 2: ad creative ----
const T_RUSLAN = 3200;
const T_YOU = 2400;

const creativeHuman = makePlayer([
  {
    side: "in",
    name: "Руслан",
    text: "Салем! По вебинару накину пару заголовков, гляну как время будет 🙌",
    typeMs: T_RUSLAN,
  },
  { side: "out", text: "Руслан, только побыстрее, запуск на выходных", typeMs: T_YOU },
  {
    side: "in",
    name: "Руслан",
    text: "«Маркетинг, который приводит клиентов» — норм?",
    typeMs: T_RUSLAN,
  },
  { side: "out", text: "Слишком общо, надо конкретнее и с оффером", typeMs: T_YOU },
  {
    side: "in",
    name: "Руслан",
    text: "Принял. Картинку дизайнер сделает, он щас занят, заказов много 🙈",
    typeMs: T_RUSLAN,
  },
  { side: "out", text: "Руслан, опять ждать? У нас же запуск горит", typeMs: T_YOU },
  { side: "in", name: "Руслан", text: "К обеду скину, край — завтра утром", typeMs: T_RUSLAN },
]);

const creativeAi = makePlayer([
  { side: "out", text: "Нужен креатив на онлайн-вебинар по маркетингу", typeMs: T_YOU },
  {
    side: "in",
    name: "ИИ",
    text: "Понял! Аудитория — предприниматели малого бизнеса? И где крутим рекламу?",
    typeMs: T_AI,
  },
  { side: "out", text: "Да, малый бизнес. Instagram и Meta", typeMs: T_YOU },
  {
    side: "in",
    name: "ИИ",
    text: "Заголовок: «Как привлекать клиентов из соцсетей за один вечер». Подзаголовок: «Бесплатный онлайн-вебинар · сегодня в 19:00».",
    typeMs: T_AI,
  },
  {
    side: "in",
    name: "ИИ",
    text: "На картинке: предприниматель вечером за ноутбуком, на экране — растущий график заявок, тёплый свет.",
    typeMs: T_AI,
  },
  { side: "out", text: "А можно вариант посмелее?", typeMs: T_YOU },
  {
    side: "in",
    name: "ИИ",
    text: "«5 ошибок в рекламе, из-за которых вы теряете клиентов».",
    typeMs: T_AI,
  },
  {
    side: "in",
    name: "ИИ",
    text: "Готово ✅ Заголовок, подзаголовок и картинка собраны — креатив готов, можете запускать 🚀",
    typeMs: T_AI,
  },
]);

// ---- Shared controls ----
const human = computed(() => (mode.value === "leads" ? leadsHuman : creativeHuman));
const ai = computed(() => (mode.value === "leads" ? leadsAi : creativeAi));
const activeRunning = computed(() => human.value.running || ai.value.running);

function startChats(): void {
  if (activeRunning.value) return;
  human.value.start();
  ai.value.start();
}

const summary = computed(() => {
  if (!ai.value.done) return null;
  if (mode.value === "leads") {
    return {
      text: `ИИ обслужил клиента за ${seconds(leadsAi.ms)} с — быстрее живого менеджера и подробнее. И так с каждым, круглосуточно и без устали.`,
    };
  }
  return {
    text: `ИИ собрал креатив прямо в переписке за ${seconds(creativeAi.ms)} с — а согласование с маркетологом растянулось бы на полдня.`,
  };
});

onUnmounted(() => {
  for (const p of [leadsHuman, leadsAi, creativeHuman, creativeAi]) p.stop();
});
</script>

<template>
  <section class="overflow-x-clip bg-stone text-graphite" aria-labelledby="demo-title">
    <div class="relative mx-auto max-w-6xl border-x border-rule">
      <TextAnimate
        id="demo-title"
        as="h2"
        animation="slideUp"
        by="word"
        :duration="0.4"
        class="px-4 pt-12 pb-4 text-3xl font-medium leading-tight sm:px-6 sm:pt-16 sm:text-5xl"
      >
        Попробуйте ИИ в деле
      </TextAnimate>
      <p
        class="rise px-4 pb-6 text-base leading-relaxed text-graphite/70 sm:px-6 sm:pb-8 sm:text-lg"
      >
        {{
          mode === "leads"
            ? "Один клиент, два чата: слева его обслуживает менеджер вручную, справа — ИИ. Запустите оба и сравните."
            : "Слева — согласование креатива с маркетологом. Справа ИИ собирает креатив прямо в переписке. Запустите оба чата."
        }}
      </p>

      <div class="px-4 pb-10 sm:px-6">
        <div
          role="tablist"
          class="inline-flex gap-1 rounded-full border border-rule bg-snow p-1 text-sm font-medium"
        >
          <button
            v-for="tab in [
              { id: 'leads', label: 'Обработка заявок' },
              { id: 'creative', label: 'Рекламный креатив' },
            ]"
            :key="tab.id"
            role="tab"
            type="button"
            :aria-selected="mode === tab.id"
            class="rounded-full px-4 py-2 transition-colors"
            :class="
              mode === tab.id ? 'bg-graphite text-white' : 'text-graphite/70 hover:text-graphite'
            "
            @click="mode = tab.id as Mode"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="border-t border-rule px-4 py-12 sm:px-6 sm:py-16">
        <div class="grid gap-3 sm:gap-4 lg:grid-cols-2">
          <!-- LEFT: human -->
          <div data-reveal class="flex flex-col rounded-2xl border border-rule bg-snow p-5 sm:p-6">
            <div class="flex items-baseline justify-between">
              <h3 class="text-lg font-medium sm:text-xl">
                {{ mode === "leads" ? "Менеджер — вручную" : "Вы и маркетолог Руслан" }}
              </h3>
              <span class="text-sm tabular-nums text-quiet">{{ seconds(human.ms) }} с</span>
            </div>
            <ChatThread
              class="mt-4"
              theme="light"
              :messages="human.shown"
              :typing="human.typing"
              :started="human.running"
              :idle="
                mode === 'leads'
                  ? 'Здесь менеджер отвечает клиенту вручную.'
                  : 'Здесь согласование креатива с маркетологом.'
              "
            />
          </div>

          <!-- RIGHT: AI -->
          <div
            data-reveal
            data-delay="100"
            class="flex flex-col rounded-2xl bg-graphite p-5 text-white sm:p-6"
          >
            <div class="flex items-baseline justify-between">
              <h3 class="text-lg font-medium sm:text-xl">ИИ — автоматически</h3>
              <span class="text-sm tabular-nums text-white/60">{{ seconds(ai.ms) }} с</span>
            </div>
            <ChatThread
              class="mt-4"
              theme="dark"
              :messages="ai.shown"
              :typing="ai.typing"
              :started="ai.running"
              :idle="
                mode === 'leads'
                  ? 'Здесь того же клиента обслуживает ИИ.'
                  : 'Здесь ИИ собирает креатив прямо в чате.'
              "
            />
          </div>
        </div>

        <div class="mt-6 flex justify-center sm:mt-8">
          <button
            type="button"
            :disabled="activeRunning"
            class="h-12 rounded-full bg-graphite px-8 text-base font-semibold text-white shadow-2xl transition-opacity hover:opacity-90 disabled:opacity-50"
            @click="startChats"
          >
            {{ activeRunning ? "Чаты идут…" : summary ? "Запустить заново" : "Запустить чаты" }}
          </button>
        </div>

        <div
          v-if="summary"
          class="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-peach-line bg-peach-soft/50 px-5 py-6 text-center sm:mt-8"
        >
          <p class="max-w-2xl text-lg font-medium text-graphite sm:text-xl">{{ summary.text }}</p>
          <BookLink variant="dark" offset="stone" location="lead-magnet" class="h-14 px-8 text-base"
            >Хочу так же — записаться</BookLink
          >
        </div>
      </div>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-rule" />
  </section>
</template>
