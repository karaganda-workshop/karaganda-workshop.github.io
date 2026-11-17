<script setup lang="ts">
import BookLink from "@/components/BookLink.vue";
import { navLinks } from "@/content";
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-rule bg-stone/85 backdrop-blur-xl">
    <div
      class="relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6"
    >
      <a
        href="#top"
        class="flex items-center gap-2 rounded-sm text-sm font-semibold text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite"
      >
        <svg viewBox="0 0 16 16" class="hidden size-4 sm:block" aria-hidden="true">
          <path
            d="M8 1.5 14 5v6l-6 3.5L2 11V5z"
            fill="#fbfbf8"
            stroke="#111110"
            stroke-width="1.3"
            stroke-linejoin="round"
          />
          <path
            d="M2 5l6 3.5L14 5M8 8.5v6"
            fill="none"
            stroke="#111110"
            stroke-width="1.3"
            stroke-linejoin="round"
          />
        </svg>
        Караганда
      </a>
      <nav class="flex items-center gap-3 sm:gap-7 md:absolute md:left-1/2 md:-translate-x-1/2">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="rounded-sm text-sm text-graphite/75 transition-colors duration-200 hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite"
        >
          {{ link.label }}
        </a>
      </nav>
      <BookLink variant="dark" offset="stone" class="h-10 px-4 text-sm sm:h-11 sm:px-6 sm:text-base"
        >Записаться</BookLink
      >
    </div>
  </header>
</template>
