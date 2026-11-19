<script setup lang="ts">
/** A Claude-styled chat for the AI side of the creative scenario: warm cream
 *  canvas, the coral spark mark, assistant replies as plain text blocks, your
 *  messages as light bubbles. Display-only — the parent drives the animation. */
import { nextTick, ref, watch } from "vue";

export interface ClaudeMsg {
  side: "in" | "out"; // in = Claude, out = you
  name?: string;
  text: string;
}

const props = defineProps<{
  messages: ClaudeMsg[];
  typing: { side: "in" | "out"; name?: string } | null;
  started: boolean;
  idle: string;
}>();

const scroller = ref<HTMLElement | null>(null);
watch(
  () => [props.messages.length, props.typing] as const,
  () =>
    nextTick(() => {
      const el = scroller.value;
      if (el) el.scrollTop = el.scrollHeight;
    }),
);
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-2xl border border-rule bg-[#faf9f5]">
    <!-- header -->
    <div class="flex items-center gap-2 border-b border-rule/70 px-4 py-2.5">
      <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0" aria-hidden="true">
        <path
          d="M12 1.5c.5 4.6 2.9 7 7.5 7.5-4.6.5-7 2.9-7.5 7.5-.5-4.6-2.9-7-7.5-7.5C9.1 8.5 11.5 6.1 12 1.5z"
          fill="#d97757"
        />
        <path
          d="M18.5 14c.3 2.4 1.6 3.7 4 4-2.4.3-3.7 1.6-4 4-.3-2.4-1.6-3.7-4-4 2.4-.3 3.7-1.6 4-4z"
          fill="#d97757"
          opacity="0.8"
        />
      </svg>
      <div class="min-w-0">
        <p class="text-sm font-semibold text-graphite sm:text-base">Claude</p>
        <p class="text-xs text-graphite/55">ИИ-ассистент</p>
      </div>
    </div>

    <!-- canvas -->
    <div
      ref="scroller"
      class="flex h-64 flex-col gap-4 overflow-y-auto scroll-smooth p-4 text-sm text-graphite"
    >
      <template v-if="messages.length || started">
        <template v-for="(m, i) in messages" :key="i">
          <!-- Claude reply: plain block with spark -->
          <div v-if="m.side === 'in'" class="flex gap-2">
            <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
              <path
                d="M12 1.5c.5 4.6 2.9 7 7.5 7.5-4.6.5-7 2.9-7.5 7.5-.5-4.6-2.9-7-7.5-7.5C9.1 8.5 11.5 6.1 12 1.5z"
                fill="#d97757"
              />
            </svg>
            <p class="leading-relaxed">{{ m.text }}</p>
          </div>
          <!-- your message: light bubble -->
          <p
            v-else
            class="max-w-[85%] self-end rounded-2xl rounded-br-sm border border-rule bg-white px-3 py-2 leading-snug"
          >
            {{ m.text }}
          </p>
        </template>
        <div v-if="typing && typing.side === 'in'" class="flex gap-2">
          <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
            <path
              d="M12 1.5c.5 4.6 2.9 7 7.5 7.5-4.6.5-7 2.9-7.5 7.5-.5-4.6-2.9-7-7.5-7.5C9.1 8.5 11.5 6.1 12 1.5z"
              fill="#d97757"
            />
          </svg>
          <span class="typing text-[#d97757]" aria-label="печатает"><span /><span /><span /></span>
        </div>
      </template>
      <p v-else class="m-auto max-w-[16rem] text-center text-graphite/50">{{ idle }}</p>
    </div>

    <!-- decorative composer -->
    <div class="px-3 pb-3" aria-hidden="true">
      <div
        class="flex items-center gap-2 rounded-2xl border border-rule bg-white px-3 py-2 text-graphite/45"
      >
        <span class="flex-1 text-sm">Сообщение Claude…</span>
        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#d97757] text-white">
          <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
            <path
              d="M12 19V5M6 11l6-6 6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>
