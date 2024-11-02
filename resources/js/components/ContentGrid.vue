<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="content.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                v-for="item in content"
                :key="item.id"
                class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                @click="showDetail(item.id)"
            >
                <!-- Image with fallback -->
                <div class="relative w-full aspect-[3/2]">
                    <img
                        v-if="item.image"
                        :src="item.image"
                        :alt="item.title"
                        class="w-full h-full object-cover object-[center_40%]"
                        @error="handleImageError"
                    />
                    <div
                        v-else
                        class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                    >
                        <span class="text-gray-500 dark:text-gray-400">No Image</span>
                    </div>
                </div>
                <div class="p-6">
                    <h3
                        class="text-xl font-semibold text-gray-800 dark:text-white mb-2"
                    >
                        {{ item.title }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300">
                        {{ item.description }}
                    </p>
                    <div class="mt-4">
                        <span
                            class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                            >Read more →</span
                        >
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div 
            v-else-if="!loading" 
            class="text-center py-12"
        >
            <p class="text-gray-600 dark:text-gray-400 text-lg">
                No content available yet.
            </p>
        </div>

        <!-- Loading State -->
        <div 
            v-if="loading" 
            class="text-center py-12"
        >
            <p class="text-gray-600 dark:text-gray-400 text-lg">
                Loading...
            </p>
        </div>
    </div>
</template>

<script>
import ServiceProvider from '../services/ServiceProvider';

export default {
    name: 'ContentGrid',
    data() {
        return {
            content: [],
            loading: true
        };
    },
    async created() {
        try {
            this.content = await ServiceProvider.contentService.findAll();
        } catch (error) {
            console.error('Error loading content:', error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        showDetail(id) {
            this.$router.push({ name: 'content-detail', params: { id } });
        },
        handleImageError(event) {
            event.target.style.display = 'none';
            event.target.parentElement.innerHTML = `
                <div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400">No Image</span>
                </div>
            `;
        }
    }
};
</script>
