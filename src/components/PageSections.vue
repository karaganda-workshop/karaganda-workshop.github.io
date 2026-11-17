<script setup lang="ts">
/** Everything below the hero: facts, partners, results, speakers, price + bonuses. */
import BookLink from "@/components/BookLink.vue";
import FactIcon from "@/components/FactIcon.vue";
import TextAnimate from "@/components/ui/TextAnimate.vue";
import { bonuses, facts, partners, price, results, speakers } from "@/content";
</script>

<template>
  <section class="overflow-x-clip bg-stone text-graphite" aria-label="Когда и где">
    <div class="relative mx-auto max-w-6xl border-x border-rule px-4 py-12 sm:px-6 sm:py-16">
      <ul class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <li
          v-for="(fact, index) in facts"
          :key="fact.question"
          data-reveal
          :data-delay="index * 70"
          class="group flex flex-col rounded-2xl border border-rule bg-snow/70 p-4 transition-colors duration-300 hover:border-graphite/20 hover:bg-snow sm:p-6"
        >
          <FactIcon
            :kind="fact.icon"
            class="-ml-1 h-16 w-auto self-start transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:h-20"
          />
          <h3 class="mt-5 text-lg font-medium leading-tight sm:text-2xl">{{ fact.question }}</h3>
          <p class="mt-2 text-sm leading-normal text-quiet sm:text-base">{{ fact.answer }}</p>
        </li>
      </ul>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-rule" />
  </section>

  <section class="overflow-x-clip bg-stone text-graphite" aria-labelledby="partners-title">
    <div class="relative mx-auto max-w-6xl border-x border-rule">
      <TextAnimate
        id="partners-title"
        as="h2"
        animation="slideUp"
        by="word"
        :duration="0.4"
        class="px-4 pt-12 pb-10 text-3xl font-medium leading-tight sm:px-6 sm:pt-16 sm:pb-12 sm:text-5xl"
      >
        Помогли в организации
      </TextAnimate>
      <ul class="grid grid-cols-2 border-t border-rule">
        <li
          v-for="(logo, i) in partners"
          :key="logo.alt"
          data-reveal
          :data-delay="i * 70"
          class="flex h-36 items-center justify-center border-rule px-4 sm:h-60 sm:px-8"
          :class="{ 'border-r': i === 0 }"
        >
          <img
            :src="logo.src"
            :alt="logo.alt"
            class="w-auto max-w-full object-contain"
            :class="logo.size"
          />
        </li>
      </ul>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-rule" />
  </section>

  <section class="overflow-x-clip bg-stone text-graphite" aria-labelledby="results-title">
    <div class="relative mx-auto max-w-6xl border-x border-rule">
      <TextAnimate
        id="results-title"
        as="h2"
        animation="slideUp"
        by="word"
        :duration="0.4"
        class="px-4 pt-12 pb-10 text-3xl font-medium leading-tight sm:px-6 sm:pt-16 sm:pb-12 sm:text-5xl"
      >
        Результаты воркшопа
      </TextAnimate>
      <div class="border-t border-rule px-4 py-12 sm:px-6 sm:py-16">
        <ol class="grid gap-3 sm:gap-4 md:grid-cols-3">
          <li
            v-for="(item, index) in results"
            :key="item.text"
            data-reveal
            :data-delay="index * 80"
            class="group relative flex flex-col rounded-2xl border border-rule bg-snow/70 p-5 transition-colors duration-300 hover:border-graphite/20 hover:bg-snow sm:p-6"
          >
            <span
              class="absolute top-5 right-5 text-sm tabular-nums text-quiet sm:top-6 sm:right-6"
            >
              0{{ index + 1 }}
            </span>
            <FactIcon
              :kind="item.icon"
              class="-ml-1 h-16 w-auto self-start transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:h-20"
            />
            <p class="mt-5 text-lg leading-snug font-medium sm:text-2xl">{{ item.text }}</p>
          </li>
        </ol>
        <div data-reveal class="mt-10 flex justify-center">
          <BookLink variant="dark" offset="stone" class="h-14 px-8 text-base"
            >Забронировать место</BookLink
          >
        </div>
      </div>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-rule" />
  </section>

  <section
    id="speakers"
    class="scroll-mt-14 overflow-x-clip bg-stone text-graphite"
    aria-labelledby="speakers-title"
  >
    <div class="relative mx-auto max-w-6xl border-x border-rule">
      <TextAnimate
        id="speakers-title"
        as="h2"
        animation="slideUp"
        by="word"
        :duration="0.4"
        class="px-4 pt-12 pb-10 text-3xl font-medium leading-tight sm:px-6 sm:pt-16 sm:pb-12 sm:text-5xl"
      >
        Кто выступает
      </TextAnimate>
      <div class="border-t border-rule px-4 py-12 sm:px-6 sm:py-16">
        <ul class="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <li
            v-for="(speaker, index) in speakers"
            :key="speaker.name"
            data-reveal
            :data-delay="index * 80"
            class="group flex flex-col rounded-2xl border border-rule bg-snow/70 p-3 transition-colors duration-300 hover:border-graphite/20 hover:bg-snow"
          >
            <div class="overflow-hidden rounded-xl bg-night">
              <img
                :src="speaker.photo"
                :alt="speaker.name"
                loading="lazy"
                class="aspect-square w-full object-cover object-top sm:aspect-[4/5] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div class="flex flex-1 flex-col px-2 pt-5 pb-3 sm:px-3">
              <span
                class="self-start rounded-full border border-peach-line bg-peach-soft px-2.5 py-0.5 text-xs font-medium text-peach-ink"
              >
                {{ speaker.topic }}
              </span>
              <h3 class="mt-3 text-xl font-medium sm:text-2xl">{{ speaker.name }}</h3>
              <p class="mt-2 text-sm leading-normal text-quiet sm:text-base">{{ speaker.role }}</p>
            </div>
          </li>
        </ul>
      </div>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-rule" />
  </section>

  <section
    id="price"
    class="scroll-mt-14 overflow-x-clip bg-stone text-graphite"
    aria-labelledby="price-title"
  >
    <div class="relative mx-auto max-w-6xl border-x border-rule">
      <TextAnimate
        id="price-title"
        as="h2"
        animation="slideUp"
        by="word"
        :duration="0.4"
        class="px-4 pt-12 pb-10 text-3xl font-medium leading-tight sm:px-6 sm:pt-16 sm:pb-12 sm:text-5xl"
      >
        Стоимость участия
      </TextAnimate>

      <div
        class="grid gap-3 border-t border-rule px-4 py-12 sm:gap-4 sm:px-6 sm:py-16 lg:grid-cols-5"
      >
        <!-- Price: the one dark panel on the page, so the eye lands here first. -->
        <article
          data-reveal
          class="relative overflow-hidden rounded-3xl bg-graphite p-6 text-snow sm:p-10 lg:col-span-3"
        >
          <div class="price-grid absolute inset-0" aria-hidden="true" />
          <div class="relative flex h-full flex-col">
            <span
              class="self-start rounded-full border border-snow/15 px-3 py-1 text-xs text-snow/70 sm:text-sm"
            >
              Билет на воркшоп
            </span>
            <p class="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span class="text-6xl font-medium tracking-tight tabular-nums sm:text-8xl">
                {{ price.amount }}
              </span>
              <span class="text-xl text-snow/70 sm:text-2xl">{{ price.unit }}</span>
            </p>
            <p class="mt-4 max-w-md text-base leading-normal text-mist">{{ price.note }}</p>

            <ul class="mt-8 space-y-3 border-t border-snow/10 pt-6">
              <li
                v-for="item in price.included"
                :key="item"
                class="flex items-start gap-3 text-base text-snow/90"
              >
                <svg viewBox="0 0 20 20" class="mt-0.5 size-5 shrink-0" aria-hidden="true">
                  <circle cx="10" cy="10" r="9" fill="#fbe2d5" />
                  <path
                    d="m6 10.2 2.6 2.6L14 7.4"
                    fill="none"
                    stroke="#9a4a2a"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ item }}
              </li>
            </ul>

            <div class="mt-10 lg:mt-auto lg:pt-10">
              <BookLink variant="light" offset="night" class="h-14 px-8 text-base">
                Забронировать место
              </BookLink>
            </div>
          </div>
        </article>

        <!-- Bonuses: peach is the site's accent colour. -->
        <div class="flex flex-col gap-3 sm:gap-4 lg:col-span-2">
          <article
            v-for="(bonus, index) in bonuses"
            :key="bonus.title"
            data-reveal
            :data-delay="120 + index * 100"
            class="group relative flex flex-1 flex-col rounded-3xl border border-peach-line bg-peach-soft p-6 sm:p-7"
          >
            <span
              class="absolute top-6 right-6 rounded-full bg-graphite px-2.5 py-0.5 text-xs font-medium text-snow sm:top-7 sm:right-7"
            >
              Бонус
            </span>
            <FactIcon
              :kind="bonus.icon"
              class="-ml-1 h-16 w-auto self-start transition-transform duration-500 ease-out group-hover:-translate-y-1"
            />
            <p class="mt-4 text-sm text-peach-ink">{{ bonus.label }}</p>
            <h3 class="mt-1 text-xl font-medium sm:text-2xl">{{ bonus.title }}</h3>
            <p class="mt-2 text-sm leading-normal text-graphite/70 sm:text-base">
              {{ bonus.text }}
            </p>
          </article>
          <p class="px-1 text-sm text-quiet">Оба бонуса входят в стоимость билета.</p>
        </div>
      </div>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-rule" />
  </section>
</template>
