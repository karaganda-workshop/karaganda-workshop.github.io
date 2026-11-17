<script setup lang="ts">
/**
 * Every booking button ("Записаться" / "Забронировать место") opens the
 * WhatsApp chat and is a ShimmerButton.
 * `dark` is the graphite pill used on light sections; `light` sits on the
 * dark price panel. Size it (height, padding, text size) via `class`.
 */
import ShimmerButton from "@/components/ui/ShimmerButton.vue";
import { WHATSAPP } from "@/content";

withDefaults(defineProps<{ variant?: "dark" | "light"; offset?: "night" | "paper" | "stone" }>(), {
  variant: "dark",
  offset: "stone",
});
</script>

<template>
  <ShimmerButton
    as="a"
    :href="WHATSAPP"
    target="_blank"
    rel="noopener noreferrer"
    :padded="false"
    :background="variant === 'light' ? '#fbfbf8' : '#111110'"
    :shimmer-color="variant === 'light' ? '#e9a081' : '#ffffff'"
    class="shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    :class="[
      variant === 'light' ? 'focus-visible:ring-snow' : 'focus-visible:ring-graphite',
      {
        night: 'focus-visible:ring-offset-night',
        paper: 'focus-visible:ring-offset-paper',
        stone: 'focus-visible:ring-offset-stone',
      }[offset],
    ]"
  >
    <span
      class="text-center leading-none font-semibold tracking-tight whitespace-pre-wrap"
      :class="variant === 'light' ? 'text-graphite' : 'text-white'"
    >
      <slot />
    </span>
  </ShimmerButton>
</template>
