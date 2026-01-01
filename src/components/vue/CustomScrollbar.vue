<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

interface Props {
  hideDelay?: number;
  scrollStep?: number;
  scrollSpeed?: number;
}

const props = withDefaults(defineProps<Props>(), {
  hideDelay: 1000,
  scrollStep: 40,
  scrollSpeed: 50,
});

const isVisible = ref(false);
const isDragging = ref(false);
const thumbHeight = ref(30);
const thumbTop = ref(0);

const trackRef = ref<HTMLElement | null>(null);
const hideTimeout = ref<number | null>(null);
const scrollInterval = ref<number | null>(null);

let startY = 0;
let startScrollTop = 0;

const updateThumb = (): void => {
  if (!trackRef.value) return;

  const { scrollHeight, clientHeight } = document.documentElement;
  const scrollTop = window.scrollY;

  if (scrollHeight <= clientHeight) {
    isVisible.value = false;
    return;
  }

  const trackHeight = trackRef.value.clientHeight;
  const calculatedThumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 30);

  const maxScroll = scrollHeight - clientHeight;
  const scrollPercent = scrollTop / maxScroll;
  const maxThumbTop = trackHeight - calculatedThumbHeight;

  thumbHeight.value = calculatedThumbHeight;
  thumbTop.value = scrollPercent * maxThumbTop;
};

const handleScroll = (): void => {
  isVisible.value = true;

  if (hideTimeout.value) {
    window.clearTimeout(hideTimeout.value);
  }

  hideTimeout.value = window.setTimeout(() => {
    if (!isDragging.value) {
      isVisible.value = false;
    }
  }, props.hideDelay);

  updateThumb();
};

const onDrag = (e: MouseEvent | TouchEvent): void => {
  if (!isDragging.value || !trackRef.value) return;

  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  const deltaY = clientY - startY;

  const trackHeight = trackRef.value.clientHeight;
  const maxThumbMove = trackHeight - thumbHeight.value;

  if (maxThumbMove <= 0) return;

  const scrollRatio = (document.documentElement.scrollHeight - window.innerHeight) / maxThumbMove;

  window.scrollTo({
    top: startScrollTop + deltaY * scrollRatio,
    behavior: 'auto',
  });
};

const stopDrag = (): void => {
  isDragging.value = false;
  document.body.style.userSelect = '';
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchend', stopDrag);
};

const startDrag = (e: MouseEvent | TouchEvent): void => {
  isDragging.value = true;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

  startY = clientY;
  startScrollTop = window.scrollY;

  document.body.style.userSelect = 'none';
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchend', stopDrag);
};

const jumpTo = (e: MouseEvent): void => {
  if (!trackRef.value) return;

  const rect = trackRef.value.getBoundingClientRect();
  const clickY = e.clientY - rect.top;
  const adjustedClickY = clickY - thumbHeight.value / 2;
  const maxThumbTop = rect.height - thumbHeight.value;

  const scrollPercent = Math.max(0, Math.min(adjustedClickY / maxThumbTop, 1));
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  window.scrollTo({
    top: scrollPercent * maxScroll,
    behavior: 'smooth',
  });
};

const startScrolling = (direction: number): void => {
  const scroll = () => {
    window.scrollBy({ top: direction * props.scrollStep, behavior: 'auto' });
  };
  scroll();
  scrollInterval.value = window.setInterval(scroll, props.scrollSpeed);
};

const stopScrolling = (): void => {
  if (scrollInterval.value) {
    clearInterval(scrollInterval.value);
    scrollInterval.value = null;
  }
};

const thumbStyle = computed(() => ({
  height: `${thumbHeight.value}px`,
  transform: `translate(-50%, ${thumbTop.value}px)`,
}));

onMounted(() => {
  updateThumb();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', updateThumb, { passive: true });

  const observer = new MutationObserver(updateThumb);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', updateThumb);
  if (hideTimeout.value) clearTimeout(hideTimeout.value);
  stopScrolling();
});
</script>

<template>
  <div
      class="fixed top-0 right-0 w-4 h-screen z-[9999] p-1 flex flex-col gap-1 transition-opacity duration-300 pointer-events-auto"
      :class="isVisible || isDragging ? 'opacity-100' : 'opacity-0'"
      @mouseenter="isVisible = true"
  >
    <button
        class="scroll-btn"
        @mousedown="startScrolling(-1)"
        @touchstart.prevent="startScrolling(-1)"
        @mouseup="stopScrolling"
        @mouseleave="stopScrolling"
        @touchend="stopScrolling"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div
        ref="trackRef"
        class="relative flex-grow w-full rounded-lg bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        @mousedown.self="jumpTo"
    >
      <div
          class="absolute left-1/2 w-1.5 rounded-full bg-black/25 dark:bg-white/25 backdrop-blur-md transition-[width,background] duration-200 cursor-pointer hover:w-2.5 hover:bg-black/45 dark:hover:bg-white/45"
          :class="{ '!w-2.5 !bg-black/60 dark:!bg-white/60': isDragging }"
          :style="thumbStyle"
          @mousedown.stop="startDrag"
          @touchstart.stop.prevent="startDrag"
      />
    </div>

    <button
        class="scroll-btn"
        @mousedown="startScrolling(1)"
        @touchstart.prevent="startScrolling(1)"
        @mouseup="stopScrolling"
        @mouseleave="stopScrolling"
        @touchend="stopScrolling"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
@reference "../../styles/global.css";

.scroll-btn {
  @apply flex items-center justify-center w-full h-4 rounded shrink-0;
  @apply bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60;
  @apply backdrop-blur-sm transition-all duration-200 cursor-pointer;
  @apply hover:bg-black/30 hover:text-black/90 dark:hover:bg-white/30 dark:hover:text-white/90;
  @apply active:scale-95;
}
</style>
