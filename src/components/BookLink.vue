<script setup lang="ts">
/**
 * Every booking button ("Записаться" / "Забронировать место") opens the
 * WhatsApp chat and is a ShimmerButton.
 * `dark` is the graphite pill used on light sections; `light` sits on the
 * dark price panel. Size it (height, padding, text size) via `class`.
 * A click reports a registration to Meta Pixel and Yandex Metrika, tagged
 * with `location`.
 */
import ShimmerButton from "@/components/ui/ShimmerButton.vue";
import { WHATSAPP } from "@/content";
import { trackRegistration } from "@/lib/metaPixel";
import { reachRegistrationGoal } from "@/lib/yandexMetrika";

const props = withDefaults(
  defineProps<{
    variant?: "dark" | "light";
    offset?: "night" | "paper" | "stone";
    /** Which button this is, reported with the Meta registration event. */
    location: string;
  }>(),
  { variant: "dark", offset: "stone" },
);

function onClick() {
  trackRegistration(props.location);
  reachRegistrationGoal(props.location);
}
</script>

<template>
  <ShimmerButton
    as="a"
    :href="WHATSAPP"
    target="_blank"
    rel="noopener noreferrer"
    :padded="false"
    @click="onClick"
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
