import IAuthService from "./interfaces/IAuthService";

export default class AuthService extends IAuthService {
    constructor(repository) {
        super();
        this.repository = repository;
    }

    async login(email, password) {
        try {
            const user = await this.repository.login(email, password);
            return user;
        } catch (error) {
            console.error("Login error:", error);
            throw new Error(error.message || "Failed to sign in");
        }
    }

    async logout() {
        try {
            await this.repository.logout();
        } catch (error) {
            console.error("Logout error:", error);
            throw new Error(error.message || "Failed to sign out");
        }
    }

    async getCurrentUser() {
        try {
            return await this.repository.getUser();
        } catch (error) {
            console.error("Get user error:", error);
            return null;
        }
    }

    async isAuthenticated() {
        try {
            const session = await this.repository.getSession();
            return !!session;
        } catch (error) {
            console.error("Auth check error:", error);
            return false;
        }
    }

    // Helper method to get the current session
    async getSession() {
        try {
            return await this.repository.getSession();
        } catch (error) {
            console.error("Get session error:", error);
            return null;
        }
    }
}
