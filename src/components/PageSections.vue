<script setup lang="ts">
/** Everything below the hero: facts, partners, results, speakers, price + bonuses. */
import BookLink from "@/components/BookLink.vue";
import FactIcon from "@/components/FactIcon.vue";
import LeadMagnet from "@/components/LeadMagnet.vue";
import TextAnimate from "@/components/ui/TextAnimate.vue";
import { afterSeminar, bonuses, facts, partners, price, speakers, tools } from "@/content";
</script>

<template>
  <section
    class="overflow-x-clip bg-coal text-stone"
    aria-label="Когда и где"
    data-section="facts"
  >
    <div class="relative mx-auto max-w-6xl border-x border-coal-line px-4 py-12 sm:px-6 sm:py-16">
      <ul class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <li
          v-for="(fact, index) in facts"
          :key="fact.question"
          data-reveal
          :data-delay="index * 70"
          class="group flex flex-col rounded-2xl border border-coal-line bg-coal-surface p-4 transition-colors duration-300 hover:border-coal-line-strong hover:bg-coal-raised sm:p-6"
        >
          <FactIcon
            :kind="fact.icon"
            class="-ml-1 h-16 w-auto self-start transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:h-20"
          />
          <h3 class="mt-5 text-lg font-medium leading-tight sm:text-2xl">{{ fact.question }}</h3>
          <p class="mt-2 text-sm leading-normal text-stone/55 sm:text-base">{{ fact.answer }}</p>
        </li>
      </ul>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-coal-line" />
  </section>

  <section
    class="overflow-x-clip bg-coal text-stone"
    aria-labelledby="partners-title"
    data-section="partners"
  >
    <div class="relative mx-auto max-w-6xl border-x border-coal-line">
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
      <ul class="grid grid-cols-2 border-t border-coal-line">
        <li
          v-for="(logo, i) in partners"
          :key="logo.alt"
          data-reveal
          :data-delay="i * 70"
          class="flex min-h-36 flex-col items-center justify-center gap-3 border-coal-line px-3 py-6 text-center sm:min-h-60 sm:flex-row sm:gap-5 sm:px-8 sm:text-left"
          :class="{ 'border-r': i === 0 }"
        >
          <img
            :src="logo.src"
            :alt="logo.caption ? '' : logo.alt"
            class="w-auto max-w-full shrink-0 object-contain"
            :class="logo.size"
          />
          <p v-if="logo.caption" class="max-w-[17rem] leading-snug">
            <span class="block text-xs text-stone/55 sm:text-sm">{{ logo.caption.kind }}</span>
            <span class="mt-0.5 block text-xs font-medium text-stone sm:text-base lg:text-lg">
              {{ logo.caption.name }}
            </span>
          </p>
        </li>
      </ul>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-coal-line" />
  </section>

  <section
    class="overflow-x-clip bg-coal text-stone"
    aria-labelledby="shift-title"
    data-section="shift"
  >
    <div class="relative mx-auto max-w-6xl border-x border-coal-line">
      <TextAnimate
        id="shift-title"
        as="h2"
        animation="slideUp"
        by="word"
        :duration="0.4"
        class="px-4 pt-12 pb-10 text-3xl font-medium leading-tight sm:px-6 sm:pt-16 sm:pb-12 sm:text-5xl"
      >
        Почему важно не остаться в стороне, пока рынок стремительно меняется
      </TextAnimate>
      <div class="border-t border-coal-line px-4 py-12 sm:px-6 sm:py-16">
        <div class="grid gap-3 sm:gap-4 lg:grid-cols-2">
          <div
            data-reveal
            class="flex flex-col justify-center rounded-2xl border border-coal-line bg-coal-surface p-6 sm:p-8"
          >
            <p class="text-lg leading-relaxed text-stone/75 sm:text-xl">
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
            class="group relative flex flex-col justify-center rounded-2xl border border-peach-strong/35 bg-peach-strong/[0.08] p-6 sm:p-8"
          >
            <FactIcon kind="gears" class="-ml-1 h-16 w-auto self-start sm:h-20" />
            <p class="mt-5 text-5xl leading-none font-semibold text-peach-strong sm:text-6xl">
              3 из 4
            </p>
            <p class="mt-3 text-base leading-snug text-stone/75 sm:text-lg">
              компаний в мире уже используют ИИ хотя бы в одном процессе — но единицы умеют
              превращать это в прибыль, а не в разовые эксперименты.
            </p>
            <p class="mt-3 text-xs text-stone/50">По данным исследования McKinsey, 2024</p>
          </div>
        </div>
        <div class="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:grid-cols-2">
          <div
            data-reveal
            class="flex flex-col rounded-2xl border border-coal-line bg-coal-surface p-5 sm:p-6"
          >
            <p class="text-4xl leading-none font-semibold text-peach-strong sm:text-5xl">
              в 21 раз
            </p>
            <p class="mt-3 text-sm leading-snug text-stone/75 sm:text-base">
              выше шанс довести заявку до сделки, если ответить за 5 минут, а не за 30. ИИ отвечает
              за секунды и круглосуточно.
            </p>
            <p class="mt-3 text-xs text-stone/50">По данным Harvard Business Review, 2011</p>
          </div>
          <div
            data-reveal
            data-delay="80"
            class="flex flex-col rounded-2xl border border-coal-line bg-coal-surface p-5 sm:p-6"
          >
            <p class="text-4xl leading-none font-semibold text-peach-strong sm:text-5xl">60–70%</p>
            <p class="mt-3 text-sm leading-snug text-stone/75 sm:text-base">
              рабочего времени на рутине ИИ уже может взять на себя — освобождая людей для продаж и
              клиентов.
            </p>
            <p class="mt-3 text-xs text-stone/50">По данным McKinsey, 2023</p>
          </div>
        </div>
        <div data-reveal class="mt-10 flex justify-center">
          <BookLink variant="light" offset="night" location="shift" class="h-14 px-8 text-base"
            >Не отставать — записаться</BookLink
          >
        </div>
      </div>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-coal-line" />
  </section>

  <LeadMagnet />

  <section
    class="overflow-x-clip bg-coal text-stone"
    aria-labelledby="tools-title"
    data-section="tools"
  >
    <div class="relative mx-auto max-w-6xl border-x border-coal-line">
      <TextAnimate
        id="tools-title"
        as="h2"
        animation="slideUp"
        by="word"
        :duration="0.4"
        class="px-4 pt-12 pb-10 text-3xl font-medium leading-tight sm:px-6 sm:pt-16 sm:pb-12 sm:text-5xl"
      >
        Покажем, как связать маркетинг, автоматизацию и финансы в единую эффективную цепочку
      </TextAnimate>
      <div class="border-t border-coal-line px-4 py-12 sm:px-6 sm:py-16">
        <ul class="flex flex-col gap-2 sm:gap-3 lg:flex-row lg:items-stretch lg:gap-2">
          <template v-for="(block, index) in tools" :key="block.title">
            <li
              data-reveal
              :data-delay="index * 280"
              class="group flex flex-col rounded-2xl border border-coal-line bg-coal-surface p-5 transition-colors duration-300 hover:border-coal-line-strong hover:bg-coal-raised sm:p-6 lg:min-w-0 lg:flex-1"
            >
              <FactIcon
                :kind="block.icon"
                class="-ml-1 h-16 w-auto self-start transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:h-20"
              />
              <h3 class="mt-5 text-xl font-medium leading-tight sm:text-2xl">{{ block.title }}</h3>
              <p class="mt-2 text-sm leading-normal text-stone/55 sm:text-base">{{ block.note }}</p>
              <div class="mt-5 flex flex-col gap-4">
                <div v-for="group in block.groups" :key="group.label">
                  <p class="text-xs tracking-wide text-stone/45 uppercase">{{ group.label }}</p>
                  <ul class="mt-2 flex flex-wrap gap-2">
                    <li
                      v-for="item in group.items"
                      :key="item"
                      class="rounded-full border border-peach-strong/30 bg-peach-strong/10 px-3 py-1.5 text-sm leading-none font-medium text-peach-strong"
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
    <div class="border-t border-coal-line" />
  </section>

  <section
    id="results"
    data-section="results"
    class="scroll-mt-14 overflow-x-clip bg-coal text-stone"
    aria-labelledby="after-title"
  >
    <div class="relative mx-auto max-w-6xl border-x border-coal-line">
      <TextAnimate
        id="after-title"
        as="h2"
        animation="slideUp"
        by="word"
        :duration="0.4"
        class="px-4 pt-12 pb-10 text-3xl font-medium leading-tight sm:px-6 sm:pt-16 sm:pb-12 sm:text-5xl"
      >
        После семинара вы:
      </TextAnimate>
      <div class="border-t border-coal-line px-4 py-12 sm:px-6 sm:py-16">
        <ul class="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(item, index) in afterSeminar"
            :key="item.text"
            data-reveal
            :data-delay="index * 90"
            class="group flex flex-col rounded-2xl border border-coal-line bg-coal-surface p-5 transition-colors duration-300 hover:border-coal-line-strong hover:bg-coal-raised sm:p-6"
          >
            <FactIcon
              :kind="item.icon"
              class="after-icon -ml-1 h-16 w-auto self-start sm:h-20"
              :style="{ animationDelay: index * 90 + 200 + 'ms' }"
            />
            <p class="mt-5 text-base leading-snug text-stone/85 sm:text-lg">{{ item.text }}</p>
          </li>
        </ul>
      </div>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-coal-line" />
  </section>

  <section
    id="speakers"
    data-section="speakers"
    class="scroll-mt-14 overflow-x-clip bg-coal text-stone"
    aria-labelledby="speakers-title"
  >
    <div class="relative mx-auto max-w-6xl border-x border-coal-line">
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
      <div class="border-t border-coal-line px-4 py-12 sm:px-6 sm:py-16">
        <ul class="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <li
            v-for="(speaker, index) in speakers"
            :key="speaker.name"
            data-reveal
            :data-delay="index * 80"
            class="group flex flex-col rounded-2xl border border-coal-line bg-coal-surface p-3 transition-colors duration-300 hover:border-coal-line-strong hover:bg-coal-raised"
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
                class="self-start rounded-full border border-peach-strong/30 bg-peach-strong/10 px-2.5 py-0.5 text-xs font-medium text-peach-strong"
              >
                {{ speaker.topic }}
              </span>
              <h3 class="mt-3 text-xl font-medium sm:text-2xl">{{ speaker.name }}</h3>
              <p class="mt-2 text-sm leading-normal text-stone/55 sm:text-base">{{ speaker.role }}</p>
            </div>
          </li>
        </ul>
      </div>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-coal-line" />
  </section>

  <section
    id="price"
    data-section="price"
    class="scroll-mt-14 overflow-x-clip bg-coal text-stone"
    aria-labelledby="price-title"
  >
    <div class="relative mx-auto max-w-6xl border-x border-coal-line">
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
        class="grid gap-3 border-t border-coal-line px-4 py-12 sm:gap-4 sm:px-6 sm:py-16 lg:grid-cols-5"
      >
        <!-- Price: peach-edged focal panel so the eye lands here first. -->
        <article
          data-reveal
          class="relative overflow-hidden rounded-3xl border border-peach-strong/35 bg-coal-raised p-6 text-stone sm:p-10 lg:col-span-3"
        >
          <div class="price-grid absolute inset-0" aria-hidden="true" />
          <div class="relative flex h-full flex-col">
            <span
              class="self-start rounded-full border border-stone/20 px-3 py-1 text-xs text-stone/60 sm:text-sm"
            >
              Билет на бизнес-семинар
            </span>
            <p class="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span class="text-6xl font-medium tracking-tight tabular-nums sm:text-8xl">
                {{ price.amount
                }}<span class="ml-[0.12em] text-peach-strong" aria-label="тенге">₸</span>
              </span>
              <span class="text-xl text-stone/60 sm:text-2xl">{{ price.unit }}</span>
            </p>
            <p class="mt-4 max-w-md text-base leading-normal text-stone/55">{{ price.note }}</p>

            <ul class="mt-8 space-y-3 border-t border-coal-line pt-6">
              <li
                v-for="item in price.included"
                :key="item"
                class="flex items-start gap-3 text-base text-stone/90"
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

        <!-- Bonuses: peach-accented dark cards. -->
        <div class="flex flex-col gap-3 sm:gap-4 lg:col-span-2">
          <article
            v-for="(bonus, index) in bonuses"
            :key="bonus.title"
            data-reveal
            :data-delay="120 + index * 100"
            class="group relative flex flex-1 flex-col rounded-3xl border border-coal-line bg-coal-surface p-6 sm:p-7"
          >
            <span
              class="absolute top-6 right-6 rounded-full bg-peach-strong px-2.5 py-0.5 text-xs font-medium text-coal sm:top-7 sm:right-7"
            >
              Бонус
            </span>
            <FactIcon
              :kind="bonus.icon"
              class="-ml-1 h-16 w-auto self-start transition-transform duration-500 ease-out group-hover:-translate-y-1"
            />
            <p class="mt-4 text-sm text-peach-strong">{{ bonus.label }}</p>
            <h3 class="mt-1 text-xl font-medium sm:text-2xl">{{ bonus.title }}</h3>
            <p class="mt-2 text-sm leading-normal text-stone/70 sm:text-base">
              {{ bonus.text }}
            </p>
          </article>
          <p class="px-1 text-sm text-stone/55">Оба бонуса входят в стоимость билета.</p>
        </div>
      </div>
      <span class="hero-plus hero-plus-bottom -left-[5px] bottom-0" aria-hidden="true" />
      <span class="hero-plus hero-plus-bottom -right-[5px] bottom-0" aria-hidden="true" />
    </div>
    <div class="border-t border-coal-line" />
  </section>
</template>
