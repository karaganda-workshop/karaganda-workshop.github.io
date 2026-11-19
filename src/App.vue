<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import HeroSection from "@/components/HeroSection.vue";
import PageSections from "@/components/PageSections.vue";
import SiteHeader from "@/components/SiteHeader.vue";
import { initSectionTracking } from "@/lib/sectionViews";

// Fade-and-rise any [data-reveal] element as it scrolls into view.
let observer: IntersectionObserver | null = null;

onMounted(() => {
  initSectionTracking();

  const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach((node) => node.classList.add("is-in"));
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.style.transitionDelay = `${Number(el.dataset.delay || 0)}ms`;
        el.classList.add("is-in");
        observer?.unobserve(el);
      }
    },
    { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
  );
  nodes.forEach((node) => observer?.observe(node));
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="min-h-screen">
    <SiteHeader />
    <main id="top">
      <HeroSection />
      <PageSections />
    </main>
    <footer class="border-t border-snow/10 bg-night px-6 py-6 text-mist">
      <div class="mx-auto flex max-w-5xl items-center justify-center">
        <p class="text-center text-xs text-snow sm:text-sm">2026 · Все права защищены</p>
      </div>
    </footer>
  </div>
</template>
