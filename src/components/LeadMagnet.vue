<script setup lang="ts">
/**
 * Interactive lead magnet with two scenarios the visitor can switch between:
 *  - "leads": answer 10 incoming requests by hand while the AI clears the
 *    same queue in seconds;
 *  - "creative": crawl through an approval chat with a marketer and the boss
 *    while the AI assembles a finished ad creative for a marketing webinar.
 * Pure client-side; it shows the value of AI before the CTA.
 */
import { computed, onUnmounted, ref } from "vue";
import BookLink from "@/components/BookLink.vue";
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

// ---------- Scenario 1: incoming requests ----------
interface Lead {
  from: string;
  text: string;
  reply: string;
}

const leads: Lead[] = [
  {
    from: "Айгерим",
    text: "Здравствуйте! Сколько стоит?",
    reply: "Здравствуйте! 15 000 ₸. Оформляем заявку?",
  },
  {
    from: "Данияр",
    text: "Доставка по Караганде есть?",
    reply: "Да, доставим за 1–2 дня по городу.",
  },
  {
    from: "Марат",
    text: "А можно в рассрочку?",
    reply: "Да, рассрочка на 3 месяца без переплаты.",
  },
  { from: "Жанна", text: "Вы сегодня работаете?", reply: "Да, до 19:00. Чем помочь?" },
  { from: "Олег", text: "Какие способы оплаты?", reply: "Kaspi, картой и наличными." },
  { from: "Сауле", text: "Гарантия есть?", reply: "Да, гарантия 12 месяцев." },
  { from: "Ержан", text: "Самовывоз возможен?", reply: "Да, забрать можно с Назарбаева 37." },
  { from: "Ирина", text: "Сколько идёт доставка?", reply: "1–2 рабочих дня по городу." },
  { from: "Нурлан", text: "Скидки бывают?", reply: "При заказе сегодня — скидка 10%." },
  { from: "Алия", text: "Подскажите наличие", reply: "Есть в наличии. Оформляем?" },
];
const TOTAL = leads.length;

const youIdx = ref(0);
const youInput = ref("");
const youReplies = ref<string[]>([]);
const youMs = ref(0);
const youTimer = makeTimer(youMs);
const youCurrent = computed<Lead | undefined>(() => leads[youIdx.value]);
const youDone = computed(() => youIdx.value >= TOTAL);

function sendYou(): void {
  if (youDone.value) return;
  const text = youInput.value.trim();
  if (!text) return;
  youTimer.start();
  youReplies.value.push(text);
  youInput.value = "";
  youIdx.value += 1;
  if (youDone.value) youTimer.stop();
}

const aiIdx = ref(0);
const aiMs = ref(0);
const aiRunning = ref(false);
const aiTimer = makeTimer(aiMs);
let aiStep: number | undefined;
const aiDone = computed(() => aiIdx.value >= TOTAL && !aiRunning.value);
const aiShown = computed(() => leads.slice(0, aiIdx.value));

function runAi(): void {
  if (aiRunning.value) return;
  aiIdx.value = 0;
  aiMs.value = 0;
  aiRunning.value = true;
  aiTimer.start();
  aiStep = window.setInterval(() => {
    aiIdx.value += 1;
    if (aiIdx.value >= TOTAL) {
      if (aiStep) clearInterval(aiStep);
      aiStep = undefined;
      aiTimer.stop();
      aiRunning.value = false;
    }
  }, 230);
}

// ---------- Scenario 2: ad creative ----------
interface Msg {
  from: "Маркетолог" | "Вы" | "Руководитель";
  text: string;
}

const creativeScript: Msg[] = [
  {
    from: "Маркетолог",
    text: "Салем! По вебинару накину пару заголовков, гляну как время будет 🙌",
  },
  { from: "Вы", text: "Давай только побыстрее, запуск на выходных" },
  { from: "Маркетолог", text: "«Маркетинг, который приводит клиентов» — норм?" },
  { from: "Вы", text: "Мне ок, но надо шефу показать" },
  { from: "Руководитель", text: "Общо как-то. И почему без оффера и цены?" },
  { from: "Вы", text: "Маркетолог, шеф просит конкретнее и добавить оффер" },
  { from: "Маркетолог", text: "Принял. Картинку дизайнер сделает, он щас занят, заказов много 🙈" },
  { from: "Вы", text: "Опять ждать… у нас же запуск горит" },
  { from: "Маркетолог", text: "К обеду скину, край — завтра утром" },
  { from: "Вы", text: "Ну давай хоть к обеду 🙏" },
];
const CREATIVE_TOTAL = creativeScript.length;

const crStep = ref(0);
const crMs = ref(0);
const crTimer = makeTimer(crMs);
const crShown = computed(() => creativeScript.slice(0, crStep.value));
const crDone = computed(() => crStep.value >= CREATIVE_TOTAL);

function nextCreative(): void {
  if (crDone.value) return;
  crTimer.start();
  crStep.value += 1;
  if (crDone.value) crTimer.stop();
}

interface AiMsg {
  from: "Вы" | "ИИ";
  text: string;
}

// The AI side is a real back-and-forth: it asks, proposes and adjusts.
const crDialog: AiMsg[] = [
  { from: "Вы", text: "Нужен креатив на онлайн-вебинар по маркетингу" },
  { from: "ИИ", text: "Понял. Аудитория — предприниматели малого бизнеса? И где крутим рекламу?" },
  { from: "Вы", text: "Да, малый бизнес. Instagram и Meta" },
  {
    from: "ИИ",
    text: "Заголовок: «Как привлекать клиентов из соцсетей за один вечер». Подзаголовок: «Бесплатный онлайн-вебинар · сегодня в 19:00».",
  },
  {
    from: "ИИ",
    text: "На картинке: предприниматель вечером за ноутбуком, на экране — растущий график заявок, тёплый свет.",
  },
  { from: "Вы", text: "А можно вариант посмелее?" },
  {
    from: "ИИ",
    text: "«5 ошибок в рекламе, из-за которых вы теряете клиентов». Готово — можно запускать 🚀",
  },
];

const crAiIdx = ref(0);
const crAiMs = ref(0);
const crAiRunning = ref(false);
const crAiTimer = makeTimer(crAiMs);
let crAiStep: number | undefined;
const crAiShown = computed(() => crDialog.slice(0, crAiIdx.value));
const crAiDone = computed(() => crAiIdx.value >= crDialog.length && !crAiRunning.value);

function runCreativeAi(): void {
  if (crAiRunning.value) return;
  crAiIdx.value = 0;
  crAiMs.value = 0;
  crAiRunning.value = true;
  crAiTimer.start();
  crAiStep = window.setInterval(() => {
    crAiIdx.value += 1;
    if (crAiIdx.value >= crDialog.length) {
      if (crAiStep) clearInterval(crAiStep);
      crAiStep = undefined;
      crAiTimer.stop();
      crAiRunning.value = false;
    }
  }, 280);
}

// ---------- Shared result ----------
const summary = computed(() => {
  if (mode.value === "leads") {
    if (!aiDone.value) return null;
    return {
      text: `ИИ ответил на все ${TOTAL} заявок за ${seconds(aiMs.value)} с — вручную это ${
        youDone.value ? `${seconds(youMs.value)} с` : "около 5 минут"
      }. И так круглосуточно, без устали и ошибок.`,
    };
  }
  if (!crAiDone.value) return null;
  return {
    text: `ИИ собрал креатив прямо в переписке за ${seconds(crAiMs.value)} с — а согласования с маркетологом и руководителем растянулись бы на полдня.`,
  };
});

function setMode(next: Mode): void {
  mode.value = next;
}

onUnmounted(() => {
  youTimer.stop();
  aiTimer.stop();
  crTimer.stop();
  crAiTimer.stop();
  if (aiStep) clearInterval(aiStep);
  if (crAiStep) clearInterval(crAiStep);
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
            ? "Слева отвечайте на входящие вручную, как в обычном чате. Справа ту же очередь разберёт ИИ."
            : "Слева — согласование креатива с маркетологом и руководителем. Справа ИИ соберёт креатив сам."
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
            @click="setMode(tab.id as Mode)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="border-t border-rule px-4 py-12 sm:px-6 sm:py-16">
        <div class="grid gap-3 sm:gap-4 lg:grid-cols-2">
          <!-- LEFT (you / manual) -->
          <div data-reveal class="flex flex-col rounded-2xl border border-rule bg-snow p-5 sm:p-6">
            <!-- leads -->
            <template v-if="mode === 'leads'">
              <div class="flex items-baseline justify-between">
                <h3 class="text-lg font-medium sm:text-xl">Вы — вручную</h3>
                <span class="text-sm tabular-nums text-quiet"
                  >{{ Math.min(youIdx, TOTAL) }} / {{ TOTAL }} · {{ seconds(youMs) }} с</span
                >
              </div>
              <div
                class="mt-4 flex h-64 flex-col gap-2 overflow-y-auto rounded-xl bg-stone/60 p-3 text-sm"
              >
                <template v-for="(lead, i) in leads.slice(0, youIdx)" :key="'y' + i">
                  <p class="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-white px-3 py-2">
                    <span class="mb-0.5 block text-xs text-quiet">{{ lead.from }}</span>
                    {{ lead.text }}
                  </p>
                  <p
                    class="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-peach-soft px-3 py-2 text-peach-ink"
                  >
                    {{ youReplies[i] }}
                  </p>
                </template>
                <p
                  v-if="youCurrent"
                  class="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-white px-3 py-2"
                >
                  <span class="mb-0.5 block text-xs text-quiet">{{ youCurrent.from }}</span>
                  {{ youCurrent.text }}
                </p>
                <p v-else class="m-auto text-center text-sm font-medium text-graphite/70">
                  Готово за {{ seconds(youMs) }} с 😮‍💨
                </p>
              </div>
              <form class="mt-3 flex gap-2" @submit.prevent="sendYou">
                <input
                  v-model="youInput"
                  :disabled="youDone"
                  type="text"
                  placeholder="Напишите ответ…"
                  aria-label="Ваш ответ на заявку"
                  class="h-11 min-w-0 flex-1 rounded-full border border-rule bg-white px-4 text-sm text-graphite outline-none focus:border-graphite/40 disabled:opacity-50"
                />
                <button
                  type="submit"
                  :disabled="youDone"
                  class="h-11 shrink-0 rounded-full bg-graphite px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  Ответить
                </button>
              </form>
            </template>

            <!-- creative -->
            <template v-else>
              <div class="flex items-baseline justify-between">
                <h3 class="text-lg font-medium sm:text-xl">Вы, маркетолог и руководитель</h3>
                <span class="text-sm tabular-nums text-quiet"
                  >{{ Math.min(crStep, CREATIVE_TOTAL) }} / {{ CREATIVE_TOTAL }} ·
                  {{ seconds(crMs) }} с</span
                >
              </div>
              <div
                class="mt-4 flex h-64 flex-col gap-2 overflow-y-auto rounded-xl bg-stone/60 p-3 text-sm"
              >
                <p v-if="crStep === 0" class="m-auto max-w-[16rem] text-center text-quiet">
                  Жмите «Дальше» — это обычная переписка, пока согласуете креатив.
                </p>
                <p
                  v-for="(m, i) in crShown"
                  :key="'c' + i"
                  class="max-w-[88%] rounded-2xl px-3 py-2"
                  :class="
                    m.from === 'Вы'
                      ? 'self-end rounded-br-sm bg-peach-soft text-peach-ink'
                      : 'self-start rounded-bl-sm bg-white'
                  "
                >
                  <span v-if="m.from !== 'Вы'" class="mb-0.5 block text-xs text-quiet">{{
                    m.from
                  }}</span>
                  {{ m.text }}
                </p>
                <p
                  v-if="crDone"
                  class="mt-1 self-center text-center text-sm font-medium text-graphite/70"
                >
                  Полдня переписки — а креатив ещё не готов.
                </p>
              </div>
              <button
                type="button"
                :disabled="crDone"
                class="mt-3 h-11 rounded-full bg-graphite px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                @click="nextCreative"
              >
                {{ crDone ? "Переписка окончена" : "Дальше →" }}
              </button>
            </template>
          </div>

          <!-- RIGHT (AI) -->
          <div
            data-reveal
            data-delay="100"
            class="flex flex-col rounded-2xl bg-graphite p-5 text-white sm:p-6"
          >
            <!-- leads -->
            <template v-if="mode === 'leads'">
              <div class="flex items-baseline justify-between">
                <h3 class="text-lg font-medium sm:text-xl">ИИ — автоматически</h3>
                <span class="text-sm tabular-nums text-white/60"
                  >{{ aiIdx }} / {{ TOTAL }} · {{ seconds(aiMs) }} с</span
                >
              </div>
              <div
                class="mt-4 flex h-64 flex-col gap-2 overflow-y-auto rounded-xl bg-white/5 p-3 text-sm"
              >
                <template v-if="aiIdx > 0">
                  <template v-for="(lead, i) in aiShown" :key="'a' + i">
                    <p
                      class="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 text-white/90"
                    >
                      <span class="mb-0.5 block text-xs text-white/50">{{ lead.from }}</span>
                      {{ lead.text }}
                    </p>
                    <p
                      class="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-peach-strong px-3 py-2 text-graphite"
                    >
                      {{ lead.reply }}
                    </p>
                  </template>
                </template>
                <p v-else class="m-auto max-w-[16rem] text-center text-sm text-white/55">
                  Нажмите «Запустить ИИ» — он ответит на все {{ TOTAL }} заявок сам.
                </p>
              </div>
              <button
                type="button"
                :disabled="aiRunning"
                class="mt-3 h-11 rounded-full bg-white px-5 text-sm font-semibold text-graphite transition-opacity hover:opacity-90 disabled:opacity-60"
                @click="runAi"
              >
                {{ aiRunning ? "Обрабатывает…" : aiDone ? "Запустить заново" : "Запустить ИИ" }}
              </button>
            </template>

            <!-- creative -->
            <template v-else>
              <div class="flex items-baseline justify-between">
                <h3 class="text-lg font-medium sm:text-xl">ИИ — автоматически</h3>
                <span class="text-sm tabular-nums text-white/60">{{ seconds(crAiMs) }} с</span>
              </div>
              <div
                class="mt-4 flex h-64 flex-col gap-2 overflow-y-auto rounded-xl bg-white/5 p-3 text-sm"
              >
                <p v-if="crAiIdx === 0" class="m-auto max-w-[17rem] text-center text-white/55">
                  Нажмите «Собрать креатив» — обсудите задачу с ИИ прямо в чате, он предложит
                  варианты.
                </p>
                <template v-else>
                  <p
                    v-for="(m, i) in crAiShown"
                    :key="'ca' + i"
                    class="max-w-[88%] rounded-2xl px-3 py-2"
                    :class="
                      m.from === 'Вы'
                        ? 'self-end rounded-br-sm bg-peach-strong text-graphite'
                        : 'self-start rounded-bl-sm bg-white/10 text-white/90'
                    "
                  >
                    <span v-if="m.from === 'ИИ'" class="mb-0.5 block text-xs text-white/50"
                      >ИИ</span
                    >
                    {{ m.text }}
                  </p>
                </template>
              </div>
              <button
                type="button"
                :disabled="crAiRunning"
                class="mt-3 h-11 rounded-full bg-white px-5 text-sm font-semibold text-graphite transition-opacity hover:opacity-90 disabled:opacity-60"
                @click="runCreativeAi"
              >
                {{ crAiRunning ? "Печатает…" : crAiDone ? "Собрать заново" : "Собрать креатив" }}
              </button>
            </template>
          </div>
        </div>

        <!-- Result -->
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
