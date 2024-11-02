<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Assistant</h3>
      <textarea
        v-model="prompt"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white mb-4"
        rows="4"
        placeholder="Describe what you'd like the AI to write about..."
      ></textarea>
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          @click="generateContent"
          :disabled="loading"
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ loading ? 'Generating...' : 'Generate' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIAssistantPopup',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      prompt: '',
      loading: false
    }
  },
  methods: {
    async generateContent() {
      this.loading = true;
      try {
        console.log('Sending request to AI endpoint');
        const response = await fetch('/api/ai-generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          },
          body: JSON.stringify({
            prompt: this.prompt
          })
        });

        console.log('Response status:', response.status);
        const responseData = await response.text();
        console.log('Response data:', responseData);

        if (!response.ok) {
          throw new Error(responseData || 'Failed to generate content');
        }

        const data = JSON.parse(responseData);
        this.$emit('content-generated', data.content);
        this.$emit('close');
        this.prompt = '';
      } catch (error) {
        console.error('Error generating content:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
