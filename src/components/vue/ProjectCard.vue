<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '../../consts';

interface Props {
  project: Project;
}

const props = defineProps<Props>();

const span = computed(() => props.project.span || 'normal');

const gridClasses = computed(() => {
  return {
    // Height handling
    'row-span-2': span.value === 'tall',
    'row-span-1': span.value !== 'tall',

    // Width handling (Responsive)
    'col-span-1': span.value === 'normal' || span.value === 'tall',

    // Wide cards: 2 columns on tablet+, but 1 on mobile
    'md:col-span-2 col-span-1': span.value === 'wide',

    // Full cards: Full width on all breakpoints
    'col-span-1 md:col-span-2 2xl:col-span-3': span.value === 'full'
  };
});

const isSpecial = computed(() => span.value !== 'normal');

const descriptionLines = computed(() => {
  if (!props.project.description) return [];
  return Array.isArray(props.project.description)
      ? props.project.description
      : [props.project.description];
});
</script>

<template>
  <a
      :href="project.url"
      target="_blank"
      rel="noopener noreferrer"
      class="group block no-underline h-full relative"
      :class="gridClasses"
  >
    <div
        class="h-full p-6 sm:p-8 rounded-[40px] flex transition-all duration-300 border backdrop-blur-[20px] backdrop-saturate-150 shadow-xl shadow-zinc-200/20 dark:shadow-zinc-900/20"
        :class="[
        // Layout: Tall cards = vertical, Others = horizontal
        span === 'tall' ? 'flex-col justify-center items-center text-center gap-6' : 'flex-row items-center gap-5',
        'bg-white/60 border-white/40 hover:border-blue-500/50 hover:bg-white/70',
        'dark:bg-black/40 dark:border-white/5 dark:hover:bg-black/50'
      ]"
    >
      <!-- Link Icon for Special Spans -->
      <div
          v-if="isSpecial"
          class="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:translate-x-1"
      >
        <i class="fa-solid fa-arrow-up-right-from-square text-blue-500/70 text-lg"></i>
      </div>

      <!-- Logo -->
      <div
          class="shrink-0 rounded-2xl flex items-center justify-center bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 group-hover:border-blue-400/50 transition-colors"
          :class="span === 'tall' ? 'w-20 h-20' : 'w-14 h-14'"
      >
        <i
            v-if="project.logo.type === 'icon'"
            :class="[project.logo.value, span === 'tall' ? 'text-4xl' : 'text-2xl']"
            class="text-zinc-500 dark:text-zinc-400 group-hover:text-blue-500 transition-colors"
        ></i>
        <span
            v-else-if="project.logo.type === 'text'"
            class="font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-blue-500 transition-colors"
            :class="span === 'tall' ? 'text-3xl' : 'text-xl'"
        >
          {{ project.logo.value }}
        </span>
        <img
            v-else-if="project.logo.type === 'image'"
            :src="project.logo.value"
            class="w-full h-full object-cover rounded-2xl"
         alt=""/>
      </div>

      <!-- Content -->
      <div class="grow min-w-0" :class="{ 'w-full': span === 'tall' }">
        <h3
            class="font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1"
            :class="span === 'tall' ? 'text-xl' : 'text-lg truncate'"
        >
          {{ project.title }}
        </h3>

        <div
            v-if="descriptionLines.length > 0"
            class="text-zinc-500 dark:text-zinc-400 leading-relaxed"
            :class="span === 'tall' ? 'text-base mt-2' : 'text-sm'"
        >
          <p
              v-for="(line, index) in descriptionLines"
              :key="index"
              :class="span !== 'tall' && 'line-clamp-1'"
          >
            {{ line }}
          </p>
        </div>
      </div>

      <!-- Chevron for Normal Cards -->
      <div v-if="!isSpecial" class="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
        <i class="fa-solid fa-chevron-right text-xs text-blue-500"></i>
      </div>
    </div>
  </a>
</template>
