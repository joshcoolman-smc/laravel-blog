<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Global Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow">
      <div class="container mx-auto px-4">
        <div class="flex justify-between h-16">
          <!-- Left side - Brand -->
          <div class="flex">
            <router-link 
              to="/" 
              class="flex items-center px-2 py-2 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
            >
              Your Basic Blog
            </router-link>
          </div>

          <!-- Right side - Auth Links -->
          <div class="flex items-center">
            <template v-if="authState">
              <!-- Admin Links -->
              <router-link 
                to="/admin/dashboard"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
              >
                Dashboard
              </router-link>
              <button 
                @click="handleLogout"
                class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <!-- Login Link -->
              <router-link 
                to="/login"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300"
              >
                Admin Login
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view></router-view>
  </div>
</template>

<script>
import ServiceProvider from './services/ServiceProvider';
import eventBus from './eventBus';

export default {
  name: 'App',
  data() {
    return {
      authState: false
    };
  },
  async created() {
    // Initialize auth state
    await this.checkAuthState();
    
    // Listen for auth state changes
    eventBus.on('auth-state-changed', async () => {
      await this.checkAuthState();
    });
  },
  methods: {
    async checkAuthState() {
      try {
        this.authState = await ServiceProvider.authService.isAuthenticated();
      } catch (error) {
        console.error('Auth check failed:', error);
        this.authState = false;
      }
    },
    async handleLogout() {
      try {
        await ServiceProvider.authService.logout();
        this.authState = false;
        // Force navigation to home page after logout
        await this.$router.push('/');
        // Force a page reload to clear any cached state
        window.location.reload();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }
};
</script>
