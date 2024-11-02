import IAuthRepository from "./interfaces/IAuthRepository";

export default class MockAuthRepository extends IAuthRepository {
    constructor() {
        super();
        this.storageKey = "auth_token";
        this.mockUser = {
            id: 1,
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
        };
    }

    async login(email, password) {
        // Accept any email/password combination
        const token = btoa(`${email}:${password}`); // Basic mock token
        this.saveToken(token);
        // Return mock user with the provided email
        return {
            ...this.mockUser,
            email: email,
        };
    }

    async logout() {
        this.clearToken();
    }

    async getSession() {
        const token = this.getToken();
        if (token) {
            return { token };
        }
        return null;
    }

    async getUser() {
        const token = this.getToken();
        if (token) {
            // Decode the token to get the email
            const [email] = atob(token).split(":");
            return {
                ...this.mockUser,
                email: email,
            };
        }
        return null;
    }

    saveToken(token) {
        localStorage.setItem(this.storageKey, token);
    }

    getToken() {
        return localStorage.getItem(this.storageKey);
    }

    clearToken() {
        localStorage.removeItem(this.storageKey);
    }
}
