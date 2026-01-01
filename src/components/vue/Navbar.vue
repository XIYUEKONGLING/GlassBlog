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
  <header class="sticky top-6 z-50 w-full px-4 pointer-events-none">
    <!-- Main Navbar Container -->
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
      <div class="hidden md:flex gap-1">
        <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="nav-link-desktop"
            :class="[isActive(link.href) ? 'active' : 'inactive']"
        >
          <i v-if="link.showIcon && link.icon" :class="[link.icon, 'mr-2 opacity-70']"></i>
          {{ link.label }}
        </a>
      </div>

      <!-- Mobile Menu Toggle -->
      <button
          @click="toggleMenu"
          class="block md:hidden p-2 -mr-2 rounded-full focus:outline-none transition-all duration-200 text-zinc-800 dark:text-zinc-100 z-[70] relative"
          aria-label="Toggle Menu"
      >
        <div class="w-6 h-6 flex flex-col justify-center gap-1.5 items-end">
          <span class="hamburger-line" :class="isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'"></span>
          <span class="hamburger-line" :class="isMenuOpen ? 'w-0 opacity-0' : 'w-4'"></span>
          <span class="hamburger-line" :class="isMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'"></span>
        </div>
      </button>
    </nav>

    <!-- Mobile Drawer System -->
    <transition name="drawer-fade">
      <div v-if="isMenuOpen" class="fixed inset-0 z-50 md:hidden pointer-events-auto">
        <!-- Dimmed Backdrop -->
        <div class="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" @click="closeMenu"></div>

        <!-- Slide-in Drawer (Panel Style) -->
        <div class="absolute right-4 top-24 bottom-4 w-72 max-w-[calc(100vw-2rem)] flex flex-col animate-drawer-slide">
          <div class="h-full flex flex-col rounded-4xl bg-white/80 dark:bg-zinc-900/80 border border-white/40 dark:border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden">

            <!-- Drawer Header -->
            <div class="p-6 border-b border-zinc-200/50 dark:border-white/5">
              <span class="text-xs font-bold text-zinc-400 uppercase tracking-widest">Navigation</span>
            </div>

            <!-- Drawer Links -->
            <div class="grow overflow-y-auto p-4 flex flex-col gap-2">
              <a
                  v-for="link in links"
                  :key="link.href"
                  :href="link.href"
                  @click="closeMenu"
                  class="drawer-link"
                  :class="[isActive(link.href) ? 'active' : 'inactive']"
              >
                <div class="flex items-center gap-3">
                  <div v-if="link.icon" class="w-8 flex justify-center text-lg opacity-70">
                    <i :class="link.icon"></i>
                  </div>
                  <span class="font-bold text-base">{{ link.label }}</span>
                </div>
                <i v-if="isActive(link.href)" class="fa-solid fa-circle text-[6px] text-blue-500"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
@reference "../../styles/global.css";

/* --- Desktop Nav Links --- */
.nav-link-desktop {
  @apply px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center border border-transparent;
}
.nav-link-desktop.active {
  @apply bg-zinc-900/5 dark:bg-white/10 text-zinc-900 dark:text-white border-zinc-200/50 dark:border-white/10;
}
.nav-link-desktop.inactive {
  @apply text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5;
}

/* --- Hamburger Icon --- */
.hamburger-line {
  @apply block h-0.5 bg-current transition-all duration-300 rounded-full;
}

/* --- Drawer Animations --- */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

@keyframes drawer-slide {
  from {
    transform: translateX(100%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

.animate-drawer-slide {
  animation: drawer-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* --- Drawer Link Styling --- */
.drawer-link {
  @apply flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200;
}

.drawer-link.active {
  @apply bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20;
}

.drawer-link.inactive {
  @apply text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5;
}

/* Touch Device Optimization */
@media (hover: none) {
  .drawer-link:active {
    @apply bg-zinc-100 dark:bg-white/10;
  }
}
</style>
