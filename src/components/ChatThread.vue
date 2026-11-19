<script setup lang="ts">
/** Presentational chat log for the lead magnet: renders messages and a typing
 *  indicator. The animation is driven by the parent; this only displays. */
export interface ChatMsg {
  side: "in" | "out";
  name?: string;
  text: string;
}
export interface Typing {
  side: "in" | "out";
  name?: string;
}

const props = defineProps<{
  messages: ChatMsg[];
  typing: Typing | null;
  started: boolean;
  theme: "light" | "dark";
  idle: string;
}>();

function bubble(side: "in" | "out"): string {
  if (props.theme === "dark") {
    return side === "in"
      ? "self-start rounded-bl-sm bg-white/10 text-white/90"
      : "self-end rounded-br-sm bg-peach-strong text-graphite";
  }
  return side === "in"
    ? "self-start rounded-bl-sm bg-white text-graphite"
    : "self-end rounded-br-sm bg-peach-soft text-peach-ink";
}
</script>

<template>
  <div
    class="flex h-72 flex-col gap-2 overflow-y-auto rounded-xl p-3 text-sm"
    :class="theme === 'dark' ? 'bg-white/5' : 'bg-stone/60'"
  >
    <template v-if="messages.length || started">
      <p
        v-for="(m, i) in messages"
        :key="i"
        class="max-w-[88%] rounded-2xl px-3 py-2"
        :class="bubble(m.side)"
      >
        <span
          v-if="m.side === 'in' && m.name"
          class="mb-0.5 block text-xs"
          :class="theme === 'dark' ? 'text-white/50' : 'text-quiet'"
          >{{ m.name }}</span
        >
        {{ m.text }}
      </p>
      <p v-if="typing" class="max-w-[88%] rounded-2xl px-3 py-2" :class="bubble(typing.side)">
        <span
          v-if="typing.side === 'in' && typing.name"
          class="mb-0.5 block text-xs"
          :class="theme === 'dark' ? 'text-white/50' : 'text-quiet'"
          >{{ typing.name }}</span
        >
        <span class="typing" aria-label="печатает"><span /><span /><span /></span>
      </p>
    </template>
    <p
      v-else
      class="m-auto max-w-[17rem] text-center"
      :class="theme === 'dark' ? 'text-white/55' : 'text-quiet'"
    >
      {{ idle }}
    </p>
  </div>
</template>
