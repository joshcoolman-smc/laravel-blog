<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Content Management
        </h1>
        <router-link
          to="/admin/content/new"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>New Post</span>
        </router-link>
      </div>

      <!-- Content List -->
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in content" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-16 w-16 relative">
                    <img 
                      v-if="item.image"
                      :src="item.image" 
                      :alt="item.title"
                      class="h-full w-full object-cover rounded"
                      @error="handleImageError"
                    >
                    <div
                      v-else
                      class="h-full w-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"
                    >
                      <span class="text-xs text-gray-500 dark:text-gray-400">No Image</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ item.title }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-500 dark:text-gray-300">
                    {{ truncate(item.description, 100) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link
                    :to="`/admin/content/${item.id}/edit`"
                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="deleteContent(item.id)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-if="content.length === 0 && !loading" 
        class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg mt-4"
      >
        <p class="text-gray-500 dark:text-gray-400">
          No content available. Create your first content piece!
        </p>
      </div>

      <!-- Loading State -->
      <div 
        v-if="loading"
        class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg mt-4"
      >
        <p class="text-gray-500 dark:text-gray-400">
          Loading...
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceProvider from '../services/ServiceProvider';

export default {
  name: 'AdminDashboard',
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
    truncate(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    async deleteContent(id) {
      if (!confirm('Are you sure you want to delete this content?')) return;
      
      try {
        await ServiceProvider.contentService.delete(id);
        this.content = this.content.filter(item => item.id !== id);
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    },
    handleImageError(event) {
      event.target.style.display = 'none';
      event.target.parentElement.innerHTML = `
        <div class="h-full w-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
          <span class="text-xs text-gray-500 dark:text-gray-400">No Image</span>
        </div>
      `;
    }
  }
};
</script>
