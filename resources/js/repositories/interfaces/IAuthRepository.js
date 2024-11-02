/**
 * Auth Repository Interface
 */
export default class IAuthRepository {
    /**
     * Login with email and password
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object>} User object
     */
    async login(email, password) {
        throw new Error("Method not implemented");
    }

    /**
     * Logout the current user
     * @returns {Promise<void>}
     */
    async logout() {
        throw new Error("Method not implemented");
    }

    /**
     * Get the current authenticated user
     * @returns {Promise<Object|null>} User object or null if not authenticated
     */
    async getUser() {
        throw new Error("Method not implemented");
    }

    /**
     * Get the current session
     * @returns {Promise<Object|null>} Session object or null if not authenticated
     */
    async getSession() {
        throw new Error("Method not implemented");
    }
}
