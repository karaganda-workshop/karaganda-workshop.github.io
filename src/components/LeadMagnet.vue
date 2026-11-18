<script setup lang="ts">
/**
 * Interactive lead magnet: process 10 incoming requests by hand (type a reply
 * to each) while, on the other side, the AI clears the same queue in seconds.
 * Pure client-side; it shows the value of automating заявки before the CTA.
 */
import { computed, onUnmounted, ref } from "vue";
import BookLink from "@/components/BookLink.vue";
import TextAnimate from "@/components/ui/TextAnimate.vue";

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

// ---- You: handle the queue by hand ----
const youIdx = ref(0);
const youInput = ref("");
const youReplies = ref<string[]>([]);
const youMs = ref(0);
let youTimer: number | undefined;

const youCurrent = computed<Lead | undefined>(() => leads[youIdx.value]);
const youDone = computed(() => youIdx.value >= TOTAL);

function startYouTimer(): void {
  if (youTimer) return;
  const base = performance.now() - youMs.value;
  youTimer = window.setInterval(() => {
    youMs.value = performance.now() - base;
  }, 100);
}
function stopYouTimer(): void {
  if (youTimer) {
    clearInterval(youTimer);
    youTimer = undefined;
  }
}
function sendYou(): void {
  if (youDone.value) return;
  const text = youInput.value.trim();
  if (!text) return;
  startYouTimer();
  youReplies.value.push(text);
  youInput.value = "";
  youIdx.value += 1;
  if (youDone.value) stopYouTimer();
}

// ---- AI: clears the whole queue automatically ----
const aiIdx = ref(0);
const aiMs = ref(0);
const aiRunning = ref(false);
let aiStep: number | undefined;
let aiTimer: number | undefined;

const aiDone = computed(() => aiIdx.value >= TOTAL && !aiRunning.value);
const aiShown = computed(() => leads.slice(0, aiIdx.value));

function runAi(): void {
  if (aiRunning.value) return;
  aiIdx.value = 0;
  aiMs.value = 0;
  aiRunning.value = true;
  const base = performance.now();
  aiTimer = window.setInterval(() => {
    aiMs.value = performance.now() - base;
  }, 60);
  aiStep = window.setInterval(() => {
    aiIdx.value += 1;
    if (aiIdx.value >= TOTAL) {
      window.clearInterval(aiStep);
      window.clearInterval(aiTimer);
      aiStep = undefined;
      aiTimer = undefined;
      aiMs.value = performance.now() - base;
      aiRunning.value = false;
    }
  }, 230);
}

const seconds = (ms: number): string => (ms / 1000).toFixed(1).replace(".", ",");

// ~30 seconds per request by hand — the benchmark the user is asked to beat.
const MANUAL_MS = TOTAL * 30000;

const summary = computed(() => {
  if (!aiDone.value) return null;
  const manualMs = youDone.value ? youMs.value : MANUAL_MS;
  const manualLabel = youDone.value ? `${seconds(youMs.value)} с` : "около 5 минут";
  const faster = Math.max(2, Math.round(manualMs / Math.max(aiMs.value, 1)));
  return { manualLabel, aiLabel: `${seconds(aiMs.value)} с`, faster };
});

onUnmounted(() => {
  stopYouTimer();
  if (aiStep) clearInterval(aiStep);
  if (aiTimer) clearInterval(aiTimer);
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
        Обработайте 10 заявок — и сравните с ИИ
      </TextAnimate>
      <p
        class="rise px-4 pb-10 text-base leading-relaxed text-graphite/70 sm:px-6 sm:pb-12 sm:text-lg"
      >
        Слева отвечайте на входящие вручную, как в обычном чате. Справа ту же очередь разберёт ИИ.
      </p>
      <div class="border-t border-rule px-4 py-12 sm:px-6 sm:py-16">
        <div class="grid gap-3 sm:gap-4 lg:grid-cols-2">
          <!-- You -->
          <div data-reveal class="flex flex-col rounded-2xl border border-rule bg-snow p-5 sm:p-6">
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
          </div>

          <!-- AI -->
          <div
            data-reveal
            data-delay="100"
            class="flex flex-col rounded-2xl bg-graphite p-5 text-white sm:p-6"
          >
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
          </div>
        </div>

        <!-- Result -->
        <div
          v-if="summary"
          class="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-peach-line bg-peach-soft/50 px-5 py-6 text-center sm:mt-8"
        >
          <p class="text-lg font-medium text-graphite sm:text-xl">
            ИИ ответил на все {{ TOTAL }} заявок за
            <span class="text-peach-ink">{{ summary.aiLabel }}</span> — вручную это
            {{ summary.manualLabel }}. И так круглосуточно, без устали и ошибок.
          </p>
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
