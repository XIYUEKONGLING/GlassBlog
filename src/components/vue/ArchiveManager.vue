<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { CollectionEntry } from 'astro:content';

interface Props {
  posts: CollectionEntry<'blog'>[];
}

const props = defineProps<Props>();

const activeCategory = ref<string | null>(null);
const activeTag = ref<string | null>(null);

// Initialize filters from URL
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  activeCategory.value = params.get('category');
  activeTag.value = params.get('tag');

  window.addEventListener('popstate', () => {
    const p = new URLSearchParams(window.location.search);
    activeCategory.value = p.get('category');
    activeTag.value = p.get('tag');
  });
});

const updateURL = () => {
  const params = new URLSearchParams();
  if (activeCategory.value) params.set('category', activeCategory.value);
  if (activeTag.value) params.set('tag', activeTag.value);

  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.pushState(null, '', newUrl);
};

const toggleCategory = (cat: string) => {
  activeCategory.value = activeCategory.value === cat ? null : cat;
  updateURL();
};

const toggleTag = (tag: string) => {
  activeTag.value = activeTag.value === tag ? null : tag;
  updateURL();
};

const clearFilters = () => {
  activeCategory.value = null;
  activeTag.value = null;
  updateURL();
};

const filteredPosts = computed(() => {
  return props.posts.filter(post => {
    const matchCat = !activeCategory.value || post.data.categories?.includes(activeCategory.value);
    const matchTag = !activeTag.value || post.data.tags?.includes(activeTag.value);
    return matchCat && matchTag;
  });
});

const postsByYear = computed(() => {
  const groups: Record<number, CollectionEntry<'blog'>[]> = {};
  filteredPosts.value.forEach(post => {
    const year = new Date(post.data.pubDate).getFullYear();
    if (!groups[year]) groups[year] = [];
    groups[year].push(post);
  });
  return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, items]) => ({ year, items }));
});
</script>

<template>
  <div>
    <!-- Active Filter Panel -->
    <Transition name="fade">
      <div v-if="activeCategory || activeTag" class="mb-8 flex flex-wrap gap-3 items-center">
        <span class="text-sm font-bold text-zinc-500 uppercase tracking-widest">Active Filters:</span>
        <button v-if="activeCategory" @click="activeCategory = null; updateURL()"
                class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex items-center gap-2 transition-all hover:bg-red-100">
          {{ activeCategory }} <i class="fa-solid fa-xmark"></i>
        </button>
        <button v-if="activeTag" @click="activeTag = null; updateURL()"
                class="px-3 py-1 bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 rounded-full text-xs font-bold flex items-center gap-2 transition-all hover:bg-red-100">
          #{{ activeTag }} <i class="fa-solid fa-xmark"></i>
        </button>
        <button @click="clearFilters" class="text-xs text-zinc-400 hover:text-blue-500 underline">Clear All</button>
      </div>
    </Transition>

    <div v-if="postsByYear.length > 0" class="space-y-12">
      <section v-for="group in postsByYear" :key="group.year" class="relative">
        <h2 class="text-2xl font-bold text-zinc-300 dark:text-white/20 mb-6 border-l-4 border-blue-500/50 pl-4">
          {{ group.year }}
        </h2>
        <div class="flex flex-col gap-1">
          <article v-for="post in group.items" :key="post.id"
                   class="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-white/10">
            <time class="w-20 shrink-0 text-sm font-mono text-zinc-400 pt-1">
              {{ new Date(post.data.pubDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) }}
            </time>
            <div class="grow">
              <a :href="`/blog/${post.id}/`" class="text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ post.data.title }}
              </a>
              <div class="flex gap-3 mt-1">
                <span v-for="cat in post.data.categories" :key="cat" class="text-[10px] font-black text-blue-500/80 uppercase tracking-tighter">
                  {{ cat }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <div v-else class="text-center py-20 text-zinc-500 bg-zinc-50/50 dark:bg-white/2 rounded-3xl border border-dashed border-zinc-200 dark:border-white/10">
      <i class="fa-regular fa-folder-open text-4xl mb-4 opacity-20"></i>
      <p>No matching articles found.</p>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
