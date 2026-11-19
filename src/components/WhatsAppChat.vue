<script setup lang="ts">
/** A WhatsApp-styled chat used for the "client" scenario in the lead magnet:
 *  green header, beige canvas, white/green bubbles with time + read ticks, and
 *  an input bar. Interactive on the left (you reply), display-only otherwise. */
import { computed, nextTick, ref, watch } from "vue";

export interface WaMsg {
  side: "in" | "out";
  name?: string;
  text: string;
}

const props = defineProps<{
  contact: string;
  messages: WaMsg[];
  typing: { side: "in" | "out"; name?: string } | null;
  started: boolean;
  idle: string;
  interactive: boolean;
  canSend?: boolean;
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: "send"): void;
}>();

const subtitle = computed(() =>
  props.typing && props.typing.side === "in" ? "печатает…" : "в сети",
);

function timeFor(i: number): string {
  const t = 12 * 60 + 10 + i;
  return `${Math.floor(t / 60) % 24}:${String(t % 60).padStart(2, "0")}`;
}

const scroller = ref<HTMLElement | null>(null);
watch(
  () => [props.messages.length, props.typing] as const,
  () =>
    nextTick(() => {
      const el = scroller.value;
      if (el) el.scrollTop = el.scrollHeight;
    }),
);

function onInput(e: Event): void {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}
function submit(): void {
  if (props.interactive && props.canSend) emit("send");
}
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-2xl border border-rule">
    <!-- header -->
    <div class="flex items-center gap-2 bg-[#075e54] px-3 py-2.5 text-white sm:gap-3 sm:px-4">
      <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0" aria-hidden="true">
        <path
          d="M15 5l-7 7 7 7"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-semibold"
        aria-hidden="true"
        >{{ contact.slice(0, 1) }}</span
      >
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold sm:text-base">{{ contact }}</p>
        <p class="truncate text-xs text-white/80">{{ subtitle }}</p>
      </div>
      <svg viewBox="0 0 24 24" class="hidden h-5 w-5 shrink-0 sm:block" aria-hidden="true">
        <path
          d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 3.5V7z"
          fill="currentColor"
        />
      </svg>
    </div>

    <!-- canvas -->
    <div
      ref="scroller"
      class="flex h-64 flex-col gap-1.5 overflow-y-auto scroll-smooth bg-[#e5ddd4] p-3 text-sm"
    >
      <template v-if="messages.length || started">
        <div
          v-for="(m, i) in messages"
          :key="i"
          class="max-w-[82%] rounded-lg px-2.5 py-1.5 shadow-sm"
          :class="
            m.side === 'in'
              ? 'self-start rounded-tl-none bg-white text-graphite'
              : 'self-end rounded-tr-none bg-[#d9fdd3] text-graphite'
          "
        >
          <p class="leading-snug">{{ m.text }}</p>
          <span class="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-graphite/45">
            {{ timeFor(i) }}
            <svg v-if="m.side === 'out'" viewBox="0 0 18 11" class="h-2.5 w-3.5" aria-hidden="true">
              <path
                d="M1 6l3 3 6-7M7 9l1 0.6M8.5 6.5L13.5 1"
                fill="none"
                stroke="#53bdeb"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
        <div
          v-if="typing"
          class="max-w-[82%] rounded-lg px-2.5 py-2 shadow-sm"
          :class="
            typing.side === 'in'
              ? 'self-start rounded-tl-none bg-white'
              : 'self-end rounded-tr-none bg-[#d9fdd3]'
          "
        >
          <span class="typing text-graphite/60" aria-label="печатает"
            ><span /><span /><span
          /></span>
        </div>
      </template>
      <p v-else class="m-auto max-w-[15rem] text-center text-graphite/55">{{ idle }}</p>
    </div>

    <!-- input bar -->
    <form
      class="flex items-center gap-2 bg-[#f0f0f0] px-2 py-2"
      :aria-hidden="!interactive || undefined"
      @submit.prevent="submit"
    >
      <div
        class="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-3 py-2 text-graphite"
      >
        <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-graphite/40" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path
            d="M8.5 14.5a4 4 0 007 0"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
        <input
          :value="modelValue"
          :disabled="!interactive || !canSend"
          :tabindex="interactive ? undefined : -1"
          type="text"
          placeholder="Сообщение"
          :aria-label="interactive ? 'Ваш ответ клиенту' : undefined"
          class="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-graphite/45 disabled:opacity-60"
          @input="onInput"
        />
        <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-graphite/40" aria-hidden="true">
          <path
            d="M8 12.5l6-6a3 3 0 014 4l-7 7a4.5 4.5 0 01-6-6l7-7"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <button
        type="submit"
        :disabled="!interactive || !canSend"
        aria-label="Отправить"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#075e54] text-white transition-opacity disabled:opacity-60"
      >
        <svg
          v-if="interactive && canSend && (modelValue ?? '').trim()"
          viewBox="0 0 24 24"
          class="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M3 11l18-8-8 18-2-7-8-3z" fill="currentColor" />
        </svg>
        <svg v-else viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true">
          <path d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z" fill="currentColor" />
          <path
            d="M6 11a6 6 0 0012 0M12 17v3"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </form>
  </div>
</template>
