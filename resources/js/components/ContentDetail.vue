<template>
    <div class="container mx-auto px-4 py-8">
        <div
            v-if="content"
            class="max-w-4xl mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden"
        >
            <!-- Image with fallback -->
            <div class="relative w-full aspect-[3/2]">
                <img
                    v-if="content.image"
                    :src="content.image"
                    :alt="content.title"
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
            <div class="p-8">
                <div class="prose dark:prose-invert max-w-none">
                    <div 
                        class="text-gray-700 dark:text-gray-200"
                        v-html="content.content"
                    ></div>
                </div>
                <div class="mt-8">
                    <button
                        @click="$router.push('/')"
                        class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        ← Back
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="text-center text-gray-600 dark:text-gray-300">
            Loading...
        </div>
    </div>
</template>

<script>
import ServiceProvider from '../services/ServiceProvider';

export default {
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            content: null
        };
    },
    async created() {
        try {
            this.content = await ServiceProvider.contentService.findById(this.id);
        } catch (error) {
            console.error('Error loading content:', error);
        }
    },
    methods: {
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
