<script setup lang="ts">
import BookLink from "@/components/BookLink.vue";
import HeroScene from "@/components/HeroScene.vue";
import TextAnimate from "@/components/ui/TextAnimate.vue";
</script>

<template>
  <section class="relative overflow-hidden bg-stone text-graphite">
    <div class="relative mx-auto max-w-6xl border-x border-rule px-6 pt-14 sm:pt-20">
      <span class="hero-plus -left-[5px] top-0" aria-hidden="true" />
      <span class="hero-plus -right-[5px] top-0" aria-hidden="true" />

      <div class="flex flex-col items-center text-center">
        <TextAnimate
          as="h1"
          animation="slideUp"
          by="word"
          :delay="0.08"
          :duration="0.4"
          class="max-w-4xl text-[2.15rem] font-medium leading-[1.06] sm:text-6xl lg:text-7xl"
        >
          Практический воркшоп для предпринимателей
        </TextAnimate>
        <p
          class="rise mt-6 max-w-2xl text-lg leading-relaxed text-graphite/65 sm:text-xl"
          style="animation-delay: 140ms"
        >
          Покажем, как <mark class="key-mark" style="--mark-delay: 0.55s">настроить рекламу</mark>,
          <mark class="key-mark" style="--mark-delay: 0.75s"
            >автоматизировать работу&nbsp;с&nbsp;клиентами</mark
          >
          и расскажем про
          <mark class="key-mark" style="--mark-delay: 0.95s">особенности налогообложения</mark>
        </p>
        <div
          class="rise mt-8 flex flex-wrap items-center justify-center gap-3"
          style="animation-delay: 220ms"
        >
          <BookLink variant="dark" offset="stone" class="h-14 px-8 text-base"
            >Забронировать место</BookLink
          >
          <a
            href="#speakers"
            class="inline-flex h-14 items-center rounded-full border border-rule bg-snow px-8 text-base font-semibold text-graphite transition-colors duration-200 hover:border-graphite/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite focus-visible:ring-offset-2 focus-visible:ring-offset-stone"
          >
            Кто выступает
          </a>
        </div>
      </div>

      <div class="rise mx-auto mt-6 max-w-2xl" style="animation-delay: 320ms">
        <HeroScene class="h-auto w-full" />
      </div>
    </div>

    <div class="border-t border-rule">
      <div class="mx-auto grid h-10 max-w-6xl grid-cols-4 border-x border-rule sm:grid-cols-8">
        <span
          v-for="i in 8"
          :key="i"
          class="border-rule"
          :class="{
            'border-r': i < 8,
            'hidden sm:block': i > 4,
            'max-sm:border-r-0': i === 4,
          }"
        />
      </div>
    </div>
  </section>
</template>
