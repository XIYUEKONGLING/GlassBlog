<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);
const isDragging = ref(false);
const thumbHeight = ref(30);
const thumbTop = ref(0);
const hideTimeout = ref<number | null>(null);

const updateScroll = () => {
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;

  if (docHeight <= windowHeight) {
    isVisible.value = false;
    return;
  }

  // Calculate dimensions
  const trackHeight = windowHeight - 40; // Subtracting padding/buttons
  const heightRatio = windowHeight / docHeight;
  thumbHeight.value = Math.max(heightRatio * trackHeight, 30);

  const maxScroll = docHeight - windowHeight;
  const scrollPercent = scrollTop / maxScroll;
  const maxThumbMove = trackHeight - thumbHeight.value;
  thumbTop.value = scrollPercent * maxThumbMove;

  showTemporarily();
};

const showTemporarily = () => {
  isVisible.value = true;
  if (hideTimeout.value) clearTimeout(hideTimeout.value);
  hideTimeout.value = window.setTimeout(() => {
    if (!isDragging.value) isVisible.value = false;
  }, 1500);
};

const scrollTo = (direction: number) => {
  window.scrollBy({ top: direction * 100, behavior: 'smooth' });
};

onMounted(() => {
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll);
  window.removeEventListener('resize', updateScroll);
});
</script>

<template>
  <div
      class="fixed top-0 right-0 w-4 h-screen z-9999 p-1 flex flex-col gap-1 transition-opacity duration-300 pointer-events-none"
      :class="{ 'opacity-100 pointer-events-auto': isVisible || isDragging }"
  >
    <button @click="scrollTo(-1)" class="scroll-btn" aria-label="Scroll Up">
      <i class="fa-solid fa-chevron-up text-[10px]"></i>
    </button>

    <div class="relative grow w-full bg-black/5 dark:bg-white/5 rounded-full">
      <div
          class="absolute left-1/2 -translate-x-1/2 w-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full cursor-pointer hover:w-2.5 transition-all"
          :style="{ height: `${thumbHeight}px`, top: `${thumbTop}px` }"
      />
    </div>

    <button @click="scrollTo(1)" class="scroll-btn" aria-label="Scroll Down">
      <i class="fa-solid fa-chevron-down text-[10px]"></i>
    </button>
  </div>
</template>

<style scoped>
@reference "../../styles/global.css";

.scroll-btn {
  @apply flex items-center justify-center w-full h-4 rounded bg-black/10 dark:bg-white/10
  text-zinc-500 hover:bg-black/20 dark:hover:bg-white/20 transition-colors pointer-events-auto;
}
</style>
