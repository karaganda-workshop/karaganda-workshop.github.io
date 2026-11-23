<script setup lang="ts">
import BookLink from "@/components/BookLink.vue";
import { navLinks } from "@/content";
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-coal-line bg-coal/85 backdrop-blur-xl">
    <!-- GSAP-style accent line pinned to the very top. -->
    <div class="h-[3px] w-full bg-peach-strong" aria-hidden="true" />
    <div
      class="relative flex h-14 items-center justify-between gap-3 px-5 sm:px-8 lg:px-12"
    >
      <div class="flex items-center gap-5 sm:gap-7">
        <a
          href="#top"
          class="flex h-11 items-center gap-2 rounded-sm text-sm font-semibold text-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone"
        >
          <svg viewBox="0 0 16 16" class="hidden size-4 sm:block" aria-hidden="true">
            <path
              d="M8 1.5 14 5v6l-6 3.5L2 11V5z"
              fill="#f1f0eb"
              stroke="#0f0f0d"
              stroke-width="1.3"
              stroke-linejoin="round"
            />
            <path
              d="M2 5l6 3.5L14 5M8 8.5v6"
              fill="none"
              stroke="#0f0f0d"
              stroke-width="1.3"
              stroke-linejoin="round"
            />
          </svg>
          Караганда
        </a>
        <nav class="flex items-center gap-4 sm:gap-6">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="inline-flex h-11 items-center rounded-sm text-sm text-stone/65 transition-colors duration-200 hover:text-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>
      <BookLink
        variant="light"
        offset="night"
        location="header"
        class="h-10 px-4 text-sm sm:h-11 sm:px-6 sm:text-base"
        >Записаться</BookLink
      >
    </div>
  </header>
</template>
