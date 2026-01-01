<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};

// Handle path active state logic
const isActive = (href: string) => {
  const normalizedPath = props.currentPath.replace(/\/$/, '') || '/';
  const normalizedHref = href.replace(/\/$/, '') || '/';

  if (normalizedHref === '/') {
    return normalizedPath === '/';
  }
  return normalizedPath.startsWith(normalizedHref);
};

// Close menu on escape key
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) closeMenu();
};

onMounted(() => {
  window.addEventListener('keydown', handleEsc);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc);
  document.body.style.overflow = '';
});
</script>

<template>
  <header class="sticky top-6 z-50 w-full px-4 pointer-events-none">
    <nav
        class="group pointer-events-auto mx-auto flex items-center justify-between w-[95%] md:w-full md:max-w-[80%] rounded-full px-6 py-3 shadow-lg backdrop-blur-[20px] backdrop-saturate-150 transition-all duration-300 ease-out bg-white/60 border border-white/40 shadow-zinc-200/20 dark:bg-black/40 dark:border-white/10 dark:shadow-zinc-900/20 relative z-50"
    >
      <!-- Logo -->
      <h2 class="text-lg font-bold tracking-tight drop-shadow-sm transition-colors text-zinc-800 dark:text-zinc-100 shrink-0">
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
            class="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out flex items-center justify-center border border-transparent hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white hover:border-black/10 dark:hover:border-white/10"
            :class="[
            isActive(link.href) 
              ? 'bg-white/40 text-zinc-900 border-white/40 shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:bg-white/15 dark:text-white dark:border-white/20 dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-md' 
              : 'text-zinc-600 dark:text-zinc-400'
          ]"
        >
          <i v-if="link.showIcon && link.icon" :class="[link.icon, 'mr-2 opacity-80']"></i>
          {{ link.label }}
        </a>
      </div>

      <!-- Mobile Menu Toggle -->
      <button
          @click="toggleMenu"
          class="block md:hidden p-2 -mr-2 rounded-full focus:outline-none transition-all duration-200 text-zinc-800 hover:bg-black/5 active:scale-95 dark:text-zinc-100 dark:hover:bg-white/10 z-50 relative"
          aria-label="Toggle Menu"
      >
        <div class="w-6 h-6 flex flex-col justify-center gap-1.5">
          <span
              class="block w-full h-0.5 bg-current transition-transform duration-300 origin-center"
              :class="{ 'rotate-45 translate-y-2': isMenuOpen }"
          ></span>
          <span
              class="block w-full h-0.5 bg-current transition-opacity duration-300"
              :class="{ 'opacity-0': isMenuOpen }"
          ></span>
          <span
              class="block w-full h-0.5 bg-current transition-transform duration-300 origin-center"
              :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"
          ></span>
        </div>
      </button>
    </nav>

    <!-- Mobile Navigation Overlay -->
    <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-if="isMenuOpen"
          class="fixed inset-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center gap-6 md:hidden"
      >
        <div class="flex flex-col gap-4 w-full max-w-xs text-center">
          <a
              v-for="link in links"
              :key="link.href"
              :href="link.href"
              @click="closeMenu"
              class="text-xl py-3 w-full justify-center relative px-4 rounded-full font-medium transition-all duration-300 flex items-center"
              :class="[
              isActive(link.href) 
                ? 'bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white' 
                : 'text-zinc-600 dark:text-zinc-400'
            ]"
          >
            <i v-if="link.showIcon && link.icon" :class="[link.icon, 'mr-3']"></i>
            {{ link.label }}
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>
