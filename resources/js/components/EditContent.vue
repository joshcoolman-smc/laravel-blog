<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isNew ? 'Create Content' : 'Edit Content' }}
        </h1>
        <button
          @click="$router.push('/admin/dashboard')"
          class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <form @submit.prevent="handleSubmit">
          <!-- Title Input -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              v-model="content.title"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              required
            >
          </div>

          <!-- Description Input -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              v-model="content.description"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              required
            >
          </div>

          <!-- Image Upload -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image
            </label>
            <div class="mt-1 flex items-center space-x-4">
              <div class="relative">
                <img
                  v-if="content.image"
                  :src="content.image"
                  :alt="content.title"
                  class="h-32 w-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  @error="handleImageError"
                />
                <div
                  v-else
                  class="h-32 w-32 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
                >
                  <span class="text-gray-500 dark:text-gray-400">No Image</span>
                </div>
                <div
                  v-if="uploadProgress !== null"
                  class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
                >
                  <div class="text-white text-center">
                    <div class="mb-2">Uploading...</div>
                    <div>{{ uploadProgress }}%</div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col space-y-2">
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileUpload"
                  accept="image/*"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  {{ content.image ? 'Change Image' : 'Upload Image' }}
                </button>
                <button
                  v-if="content.image"
                  type="button"
                  @click="removeImage"
                  class="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Remove Image
                </button>
              </div>
            </div>
          </div>

          <!-- Rich Text Editor -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <div class="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <!-- Editor Menu Bar -->
              <div class="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 flex flex-wrap gap-2 justify-between">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="item in menuItems"
                    :key="item.action"
                    @click.prevent="item.action"
                    :class="[
                      'px-2 py-1 rounded text-sm',
                      editor?.isActive(item.name) 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    ]"
                  >
                    {{ item.label }}
                  </button>
                </div>
                <button
                  v-if="showAIButton"
                  @click.prevent="showAIPopup = true"
                  class="px-2 py-1 rounded text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  AI Assistant
                </button>
              </div>

              <!-- Editor Content -->
              <editor-content 
                :editor="editor" 
                class="prose dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none dark:bg-gray-800 editor-styles"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="loading"
            >
              {{ loading ? 'Saving...' : 'Save Content' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- AI Assistant Popup -->
    <AIAssistantPopup
      :show="showAIPopup"
      @close="showAIPopup = false"
      @content-generated="handleAIContent"
    />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import ServiceProvider from '../services/ServiceProvider';
import AIAssistantPopup from './AIAssistantPopup.vue';

export default {
  name: 'EditContent',
  components: {
    EditorContent,
    AIAssistantPopup,
  },
  props: {
    id: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      editor: null,
      content: {
        title: '',
        description: '',
        content: '',
        image: null
      },
      loading: false,
      uploadProgress: null,
      showAIPopup: false,
      menuItems: [
        { label: 'Bold', name: 'bold', action: () => this.editor.chain().focus().toggleBold().run() },
        { label: 'Italic', name: 'italic', action: () => this.editor.chain().focus().toggleItalic().run() },
        { label: 'H1', name: 'heading', args: { level: 1 }, action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run() },
        { label: 'H2', name: 'heading', args: { level: 2 }, action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { label: 'Bullet List', name: 'bulletList', action: () => this.editor.chain().focus().toggleBulletList().run() },
        { label: 'Numbered List', name: 'orderedList', action: () => this.editor.chain().focus().toggleOrderedList().run() },
        { label: 'Quote', name: 'blockquote', action: () => this.editor.chain().focus().toggleBlockquote().run() },
      ]
    };
  },
  computed: {
    isNew() {
      return !this.id;
    },
    showAIButton() {
      return typeof window !== 'undefined' && window.aiWriterEnabled === true;
    }
  },
  async created() {
    if (this.id) {
      try {
        const content = await ServiceProvider.contentService.findById(this.id);
        if (content) {
          // Update the content data
          this.content = content;
          
          // Update the editor content if editor exists
          if (this.editor) {
            this.editor.commands.setContent(content.content);
          }
        }
      } catch (error) {
        console.error('Error loading content:', error);
      }
    }
  },
  mounted() {
    this.editor = new Editor({
      content: this.content.content,
      extensions: [
        StarterKit,
      ],
      editorProps: {
        attributes: {
          class: 'prose dark:prose-invert max-w-none focus:outline-none'
        }
      }
    });
  },
  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy();
    }
  },
  methods: {
    handleImageError(event) {
      event.target.style.display = 'none';
      event.target.parentElement.innerHTML = `
        <div class="h-32 w-32 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <span class="text-gray-500 dark:text-gray-400">No Image</span>
        </div>
      `;
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        this.uploadProgress = 0;
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          if (this.uploadProgress < 90) {
            this.uploadProgress += 10;
          }
        }, 200);

        // Upload the file using the service provider's upload repository
        const imageUrl = await ServiceProvider.uploadService.uploadFile(file);
        
        // Complete the progress bar
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        
        // Update the content with the new image URL
        this.content.image = imageUrl;

        // Reset progress after a short delay
        setTimeout(() => {
          this.uploadProgress = null;
        }, 500);
      } catch (error) {
        console.error('Upload failed:', error);
        this.uploadProgress = null;
      }
    },

    removeImage() {
      if (this.content.image) {
        // Revoke the object URL if needed
        ServiceProvider.uploadService.revokeObjectUrl(this.content.image);
      }
      this.content.image = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    handleAIContent(content) {
      if (this.editor) {
        this.editor.commands.setContent(content);
      }
    },

    async handleSubmit() {
      this.loading = true;
      try {
        // Get editor content
        const editorContent = this.editor.getHTML();
        
        // Update content object
        const updatedContent = {
          ...this.content,
          content: editorContent
        };

        if (this.isNew) {
          await ServiceProvider.contentService.create(updatedContent);
        } else {
          await ServiceProvider.contentService.update(this.id, updatedContent);
        }
        
        // Navigate back to dashboard
        this.$router.push('/admin/dashboard');
      } catch (error) {
        console.error('Error saving content:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
/* Add some basic Prose styling */
.prose {
  @apply text-gray-900 dark:text-gray-100;
}

.prose p {
  @apply my-4;
}

.prose h1 {
  @apply text-2xl font-bold my-4;
}

.prose h2 {
  @apply text-xl font-bold my-3;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4;
}

/* Updated list styling */
.prose ol,
.editor-styles ol {
  @apply pl-8 space-y-2 my-4;
  list-style-position: outside;
  list-style-type: decimal;
}

.prose ol li,
.editor-styles ol li {
  @apply pl-2;
}

.prose ul,
.editor-styles ul {
  @apply pl-8 space-y-2 my-4;
  list-style-position: outside;
  list-style-type: disc;
}

.prose ul li,
.editor-styles ul li {
  @apply pl-2;
}
</style>
