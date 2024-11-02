<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Admin Login
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700"
              placeholder="Email address"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700"
              placeholder="Password"
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-600 dark:text-red-400 text-sm text-center">
          {{ error }}
        </div>

        <!-- Mock Implementation Notice -->
        <div class="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
          Using mock implementation: any email/password will work
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ServiceProvider from '../services/ServiceProvider';
import eventBus from '../eventBus';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: null
    };
  },
  async created() {
    // Redirect if already authenticated
    if (await ServiceProvider.authService.isAuthenticated()) {
      this.$router.push('/admin/dashboard');
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.email || !this.password) {
        this.error = 'Please enter both email and password';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        await ServiceProvider.authService.login(this.email, this.password);
        // Emit auth state change event
        eventBus.emit('auth-state-changed');
        // Redirect to the intended page or dashboard
        const redirectPath = this.$route.query.redirect || '/admin/dashboard';
        this.$router.push(redirectPath);
      } catch (error) {
        // In mock implementation, we shouldn't hit this case
        console.error('Login error:', error);
        eventBus.emit('auth-state-changed');
        this.$router.push('/admin/dashboard');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
