<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { CollectionEntry } from 'astro:content';

interface Props {
  posts: CollectionEntry<'blog'>[];
}

const props = defineProps<Props>();

const activeCategories = ref<string[]>([]);
const activeTags = ref<string[]>([]);

/**
 * Sync internal state with URL parameters
 */
const syncFromURL = (): void => {
  const params = new URLSearchParams(window.location.search);
  activeCategories.value = params.getAll('category');
  activeTags.value = params.getAll('tag');
};

/**
 * Update the browser URL without a full page reload
 */
const updateURL = (): void => {
  const params = new URLSearchParams();
  activeCategories.value.forEach(cat => params.append('category', cat));
  activeTags.value.forEach(tag => params.append('tag', tag));

  const query = params.toString() ? '?' + params.toString() : '';
  const newUrl = `${window.location.pathname}${query}`;
  window.history.pushState(null, '', newUrl);

  // Dispatch event so other components (like Sidebar) can react if needed
  window.dispatchEvent(new Event('popstate'));
};

const removeFilter = (type: 'category' | 'tag', value: string): void => {
  if (type === 'category') {
    activeCategories.value = activeCategories.value.filter(v => v !== value);
  } else {
    activeTags.value = activeTags.value.filter(v => v !== value);
  }
  updateURL();
};

const clearAll = (): void => {
  activeCategories.value = [];
  activeTags.value = [];
  updateURL();
};

onMounted(() => {
  syncFromURL();
  window.addEventListener('popstate', syncFromURL);
});

onUnmounted(() => {
  window.removeEventListener('popstate', syncFromURL);
});

const filteredPosts = computed(() => {
  return props.posts.filter(post => {
    const postCats = post.data.categories || [];
    const postTags = post.data.tags || [];

    // Check if post contains ALL selected categories (AND logic)
    const matchesCats = activeCategories.value.length === 0 ||
        activeCategories.value.every(cat => postCats.includes(cat));

    // Check if post contains ALL selected tags (AND logic)
    const matchesTags = activeTags.value.length === 0 ||
        activeTags.value.every(tag => postTags.includes(tag));

    return matchesCats && matchesTags;
  });
});

const groupedPosts = computed(() => {
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
  <div class="min-h-100">
    <!-- Active Filter Badges -->
    <div v-if="activeCategories.length > 0 || activeTags.length > 0" class="mb-8 flex flex-wrap gap-2 items-center">
      <span class="text-xs font-bold text-zinc-400 uppercase tracking-widest mr-2">Active Filters:</span>

      <button v-for="cat in activeCategories" :key="'cat-'+cat"
              @click="removeFilter('category', cat)"
              class="flex items-center gap-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
      >
        {{ cat }} <i class="fa-solid fa-xmark opacity-50"></i>
      </button>

      <button v-for="tag in activeTags" :key="'tag-'+tag"
              @click="removeFilter('tag', tag)"
              class="flex items-center gap-2 px-2 py-1 bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 rounded-md text-xs font-bold hover:bg-red-100 transition-colors"
      >
        #{{ tag }} <i class="fa-solid fa-xmark opacity-50"></i>
      </button>

      <button @click="clearAll" class="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-2">Clear All</button>
    </div>

    <!-- Post List -->
    <div v-if="groupedPosts.length > 0" class="space-y-12">
      <section v-for="group in groupedPosts" :key="group.year" class="animate-fade-in-up">
        <h2 class="text-2xl font-bold text-zinc-300 dark:text-white/20 mb-6 border-l-4 border-blue-500/50 pl-4 select-none">
          {{ group.year }}
        </h2>

        <div class="flex flex-col">
          <article v-for="post in group.items" :key="post.id"
                   class="flex flex-col sm:flex-row gap-2 sm:gap-6 py-4 border-b border-zinc-200/50 dark:border-white/5 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-white/2 transition-colors rounded-lg px-2"
          >
            <time class="w-20 shrink-0 text-sm font-mono text-zinc-400 pt-1">
              {{ new Date(post.data.pubDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) }}
            </time>

            <div class="grow min-w-0">
              <a :href="`/blog/${post.id}/`" class="block text-lg font-bold text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-1">
                {{ post.data.title }}
              </a>

              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <div v-if="post.data.categories" class="flex gap-1.5">
                  <span v-for="c in post.data.categories" :key="c"
                        class="bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/30 font-medium"
                  >
                    {{ c }}
                  </span>
                </div>
                <div v-if="post.data.tags" class="flex items-center gap-2 text-zinc-500 opacity-60">
                  <i class="fa-solid fa-hashtag text-[10px]"></i>
                  <span>{{ post.data.tags.join(', ') }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <div v-else class="py-20 text-center text-zinc-500">
      <i class="fa-regular fa-folder-open text-4xl mb-4 opacity-30"></i>
      <p>No results found matching selected filters.</p>
    </div>
  </div>
</template>
