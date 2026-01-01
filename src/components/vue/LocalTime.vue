<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  timezone: string;
}

const props = defineProps<Props>();
const currentTime = ref('--:--');
const utcOffset = ref('');

const updateTime = () => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: props.timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZoneName: 'shortOffset'
    });

    const parts = formatter.formatToParts(now);
    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    let tzName = parts.find(p => p.type === 'timeZoneName')?.value || '';

    if (hour && minute) {
      currentTime.value = `${hour}:${minute}`;
      // 统一处理 GMT/UTC 转换，Firefox 有时会输出 GMT+8
      utcOffset.value = tzName.replace(/GMT|UTC/gi, 'UTC');
    }
  } catch (e) {
    currentTime.value = "Error";
  }
};


let timer: number;

onMounted(() => {
  updateTime();
  timer = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="tabular-nums">
    {{ currentTime }}
    <span class="text-xs opacity-60 ml-1">{{ utcOffset }}</span>
  </div>
</template>
