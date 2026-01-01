<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { NavLink } from '../../consts';

interface Props {
  siteTitle: string;
  links: NavLink[];
  currentPath: string;
}

const props = defineProps<Props>();

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const isActive = (href: string) => {
  const path = props.currentPath.replace(/\/$/, '') || '/';
  const target = href.replace(/\/$/, '') || '/';
  return target === '/' ? path === '/' : path.startsWith(target);
};

// Scroll Lock
watch(isMenuOpen, (val) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = val ? 'hidden' : '';
  }
});

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeMenu();
};

onMounted(() => {
  window.addEventListener('keydown', handleEsc);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <!-- Header Container -->
  <header class="sticky top-6 z-50 w-full px-4 pointer-events-none">
    <nav
        class="group pointer-events-auto mx-auto flex items-center justify-between w-[95%] md:w-full md:max-w-[80%] rounded-full px-6 py-3 shadow-lg backdrop-blur-xl transition-all duration-300 ease-out bg-white/60 border border-white/40 shadow-zinc-200/20 dark:bg-black/40 dark:border-white/10 dark:shadow-zinc-900/20 relative z-[60]"
    >
      <!-- Logo -->
      <h2 class="text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100 shrink-0">
        <a href="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {{ siteTitle }}
        </a>
      </h2>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex gap-2">
        <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out flex items-center justify-center border border-transparent hover:scale-105 hover:bg-black/5 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white"
            :class="[
            isActive(link.href) 
              ? 'bg-white/40 text-zinc-900 border-white/40 shadow-sm dark:bg-white/15 dark:text-white dark:border-white/20' 
              : 'text-zinc-600 dark:text-zinc-400'
          ]"
        >
          <i v-if="link.showIcon && link.icon" :class="[link.icon, 'mr-2 opacity-70']"></i>
          {{ link.label }}
        </a>
      </div>

      <!-- Mobile Menu Toggle -->
      <button
          @click="toggleMenu"
          class="block md:hidden p-2 -mr-2 rounded-full focus:outline-none transition-all duration-200 text-zinc-800 dark:text-zinc-100 z-70 relative"
          aria-label="Toggle Menu"
      >
        <div class="w-6 h-6 flex flex-col justify-center gap-1.5 items-end">
          <span class="block h-0.5 bg-current transition-all duration-300 rounded-full" :class="isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'"></span>
          <span class="block h-0.5 bg-current transition-all duration-200 rounded-full" :class="isMenuOpen ? 'w-0 opacity-0' : 'w-4'"></span>
          <span class="block h-0.5 bg-current transition-all duration-300 rounded-full" :class="isMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'"></span>
        </div>
      </button>
    </nav>

    <!-- Mobile Navigation Overlay -->
    <transition
        enter-active-class="transition-opacity duration-500 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="isMenuOpen" class="fixed inset-0 z-50 md:hidden pointer-events-auto">
        <!-- Background Layer (Acrylic) -->
        <div
            class="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-3xl saturate-150"
            @click="closeMenu"
        ></div>

        <!-- Content Layer -->
        <div class="relative h-full flex flex-col items-center justify-center p-6 pointer-events-none">
          <transition
              appear
              enter-active-class="transition-all duration-500 delay-100 ease-out"
              enter-from-class="opacity-0 translate-y-8 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
          >
            <div v-if="isMenuOpen" class="flex flex-col gap-4 w-full max-w-sm pointer-events-auto">
              <a
                  v-for="(link, index) in links"
                  :key="link.href"
                  :href="link.href"
                  @click="closeMenu"
                  class="group flex items-center justify-between px-6 py-5 rounded-4xl transition-all duration-300 border"
                  :class="[
                  isActive(link.href) 
                    ? 'bg-white/80 dark:bg-white/15 border-white/50 dark:border-white/20 text-blue-600 dark:text-blue-400 shadow-xl' 
                    : 'bg-white/40 dark:bg-black/40 border-white/20 dark:border-white/5 text-zinc-800 dark:text-zinc-200'
                ]"
              >
                <div class="flex items-center gap-4">
                  <div
                      v-if="link.showIconMobile && link.icon"
                      class="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10"
                  >
                    <i :class="[link.icon, 'text-lg']"></i>
                  </div>
                  <span class="text-xl font-bold tracking-tight">{{ link.label }}</span>
                </div>
                <i class="fa-solid fa-chevron-right text-xs opacity-20 group-hover:opacity-100 transition-opacity"></i>
              </a>
            </div>
          </transition>

          <!-- Close Button -->
          <button
              @click="closeMenu"
              class="mt-12 w-14 h-14 rounded-full bg-white/40 dark:bg-white/10 border border-white/20 dark:border-white/10 flex items-center justify-center text-zinc-500 dark:text-zinc-400 pointer-events-auto active:scale-90 transition-transform shadow-lg"
          >
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.backdrop-blur-3xl {
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
}
</style>
