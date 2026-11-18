<script setup lang="ts">
/** Everything below the hero: facts, partners, results, speakers, price + bonuses. */
import BookLink from "@/components/BookLink.vue";
import FactIcon from "@/components/FactIcon.vue";
import TextAnimate from "@/components/ui/TextAnimate.vue";
import { afterSeminar, bonuses, facts, partners, price, speakers, tools } from "@/content";
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
        При сотрудничестве
      </TextAnimate>
      <ul class="grid grid-cols-2 border-t border-rule">
        <li
          v-for="(logo, i) in partners"
          :key="logo.alt"
          data-reveal
          :data-delay="i * 70"
          class="flex min-h-36 flex-col items-center justify-center gap-3 border-rule px-3 py-6 text-center sm:min-h-60 sm:flex-row sm:gap-5 sm:px-8 sm:text-left"
          :class="{ 'border-r': i === 0 }"
        >
          <img
            :src="logo.src"
            :alt="logo.caption ? '' : logo.alt"
            class="w-auto max-w-full shrink-0 object-contain"
            :class="logo.size"
          />
          <p v-if="logo.caption" class="max-w-[17rem] leading-snug">
            <span class="block text-xs text-quiet sm:text-sm">{{ logo.caption.kind }}</span>
            <span class="mt-0.5 block text-xs font-medium text-graphite sm:text-base lg:text-lg">
              {{ logo.caption.name }}
            </span>
          </p>
        </li>
      </ul>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-rule" />
  </section>

  <section class="overflow-x-clip bg-stone text-graphite" aria-labelledby="shift-title">
    <div class="relative mx-auto max-w-6xl border-x border-rule">
      <TextAnimate
        id="shift-title"
        as="h2"
        animation="slideUp"
        by="word"
        :duration="0.4"
        class="px-4 pt-12 pb-10 text-3xl font-medium leading-tight sm:px-6 sm:pt-16 sm:pb-12 sm:text-5xl"
      >
        Рынок уже меняется — не останьтесь в стороне
      </TextAnimate>
      <div class="border-t border-rule px-4 py-12 sm:px-6 sm:py-16">
        <div class="grid gap-3 sm:gap-4 lg:grid-cols-2">
          <div
            data-reveal
            class="flex flex-col justify-center rounded-2xl border border-rule bg-snow/70 p-6 sm:p-8"
          >
            <p class="text-lg leading-relaxed text-graphite/75 sm:text-xl">
              Искусственный интеллект и автоматизация уже вошли в бизнес: реклама, обработка заявок,
              аналитика и учёт всё чаще работают
              <mark class="key-mark">почти без участия человека</mark>. Те, кто внедряет это
              первыми, забирают клиентов и экономят часы, а большинство предпринимателей
              <mark class="key-mark">не успевают за переменами</mark>.
            </p>
          </div>
          <div
            data-reveal
            data-delay="80"
            class="group relative flex flex-col justify-center rounded-2xl border border-peach-line bg-peach-soft/50 p-6 sm:p-8"
          >
            <FactIcon kind="gears" class="-ml-1 h-16 w-auto self-start sm:h-20" />
            <p class="mt-5 text-5xl leading-none font-semibold text-peach-ink sm:text-6xl">
              3 из 4
            </p>
            <p class="mt-3 text-base leading-snug text-graphite/75 sm:text-lg">
              компаний в мире уже используют ИИ хотя бы в одном процессе — но единицы умеют
              превращать это в прибыль, а не в разовые эксперименты.
            </p>
            <p class="mt-3 text-xs text-quiet">По данным исследования McKinsey, 2024</p>
          </div>
        </div>
        <div class="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:grid-cols-2">
          <div data-reveal class="rounded-2xl border border-rule bg-snow/70 p-5 sm:p-6">
            <p class="text-2xl leading-tight font-semibold text-graphite sm:text-3xl">
              Пока — вручную
            </p>
            <p class="mt-2 text-sm leading-normal text-quiet sm:text-base">
              Большинство местного бизнеса всё ещё теряет заявки и тратит часы на рутину, которую
              давно можно поручить инструментам.
            </p>
          </div>
          <div
            data-reveal
            data-delay="80"
            class="rounded-2xl border border-rule bg-snow/70 p-5 sm:p-6"
          >
            <p class="text-2xl leading-tight font-semibold text-graphite sm:text-3xl">
              Каждый день на счету
            </p>
            <p class="mt-2 text-sm leading-normal text-quiet sm:text-base">
              Конкуренты, которые настроили рекламу и автоматизацию раньше, платят за клиента меньше
              и растут быстрее.
            </p>
          </div>
        </div>
        <div data-reveal class="mt-10 flex justify-center">
          <BookLink variant="dark" offset="stone" location="shift" class="h-14 px-8 text-base"
            >Не отставать — записаться</BookLink
          >
        </div>
      </div>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-rule" />
  </section>

  <section class="overflow-x-clip bg-stone text-graphite" aria-labelledby="tools-title">
    <div class="relative mx-auto max-w-6xl border-x border-rule">
      <TextAnimate
        id="tools-title"
        as="h2"
        animation="slideUp"
        by="word"
        :duration="0.4"
        class="px-4 pt-12 pb-10 text-3xl font-medium leading-tight sm:px-6 sm:pt-16 sm:pb-12 sm:text-5xl"
      >
        Свяжем маркетинг, автоматизацию и финансы в единую цепочку
      </TextAnimate>
      <div class="border-t border-rule px-4 py-12 sm:px-6 sm:py-16">
        <ul class="flex flex-col gap-2 sm:gap-3 lg:flex-row lg:items-stretch lg:gap-2">
          <template v-for="(block, index) in tools" :key="block.title">
            <li
              data-reveal
              :data-delay="index * 280"
              class="group flex flex-col rounded-2xl border border-rule bg-snow/70 p-5 transition-colors duration-300 hover:border-graphite/20 hover:bg-snow sm:p-6 lg:min-w-0 lg:flex-1"
            >
              <FactIcon
                :kind="block.icon"
                class="-ml-1 h-16 w-auto self-start transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:h-20"
              />
              <h3 class="mt-5 text-xl font-medium leading-tight sm:text-2xl">{{ block.title }}</h3>
              <p class="mt-2 text-sm leading-normal text-quiet sm:text-base">{{ block.note }}</p>
              <div class="mt-5 flex flex-col gap-4">
                <div v-for="group in block.groups" :key="group.label">
                  <p class="text-xs tracking-wide text-quiet uppercase">{{ group.label }}</p>
                  <ul class="mt-2 flex flex-wrap gap-2">
                    <li
                      v-for="item in group.items"
                      :key="item"
                      class="rounded-full border border-peach-line/70 bg-peach-soft/40 px-3 py-1.5 text-sm leading-none font-medium text-peach-ink"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li
              v-if="index < tools.length - 1"
              data-reveal
              :data-delay="index * 280 + 140"
              class="flex shrink-0 items-center justify-center py-1 lg:w-12 lg:py-0"
              aria-hidden="true"
            >
              <span class="rotate-90 lg:rotate-0">
                <svg viewBox="0 0 48 16" class="flow-arrow h-4 w-12">
                  <path class="flow-line" d="M3 8 H40" />
                  <path class="flow-dash" d="M3 8 H40" />
                  <path class="flow-head" d="M33 3 L41 8 L33 13" />
                </svg>
              </span>
            </li>
          </template>
        </ul>
      </div>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-rule" />
  </section>

  <section
    id="results"
    class="scroll-mt-14 overflow-x-clip bg-stone text-graphite"
    aria-labelledby="after-title"
  >
    <div class="relative mx-auto max-w-6xl border-x border-rule">
      <TextAnimate
        id="after-title"
        as="h2"
        animation="slideUp"
        by="word"
        :duration="0.4"
        class="px-4 pt-12 pb-10 text-3xl font-medium leading-tight sm:px-6 sm:pt-16 sm:pb-12 sm:text-5xl"
      >
        Результаты семинара
      </TextAnimate>
      <div class="border-t border-rule px-4 py-12 sm:px-6 sm:py-16">
        <ul class="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(item, index) in afterSeminar"
            :key="item.text"
            data-reveal
            :data-delay="index * 90"
            class="group flex flex-col rounded-2xl border border-rule bg-snow/70 p-5 transition-colors duration-300 hover:border-graphite/20 hover:bg-snow sm:p-6"
          >
            <FactIcon
              :kind="item.icon"
              class="after-icon -ml-1 h-16 w-auto self-start sm:h-20"
              :style="{ animationDelay: index * 90 + 200 + 'ms' }"
            />
            <p class="mt-5 text-base leading-snug text-graphite/85 sm:text-lg">{{ item.text }}</p>
          </li>
        </ul>
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
              Билет на бизнес-семинар
            </span>
            <p class="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span class="text-6xl font-medium tracking-tight tabular-nums sm:text-8xl">
                {{ price.amount
                }}<span class="ml-[0.12em] text-peach-strong" aria-label="тенге">₸</span>
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
              <BookLink variant="light" offset="night" location="price" class="h-14 px-8 text-base">
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
