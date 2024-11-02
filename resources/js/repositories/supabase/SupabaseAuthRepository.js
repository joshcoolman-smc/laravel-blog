import IAuthRepository from "../interfaces/IAuthRepository";
import { createClient } from "@supabase/supabase-js";

export default class SupabaseAuthRepository extends IAuthRepository {
    constructor() {
        super();
        this.supabase = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY
        );
    }

    async login(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data.user;
    }

    async logout() {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
    }

    async getUser() {
        const {
            data: { user },
            error,
        } = await this.supabase.auth.getUser();
        if (error) throw error;
        return user;
    }

    async getSession() {
        const {
            data: { session },
            error,
        } = await this.supabase.auth.getSession();
        if (error) throw error;
        return session;
    }
}
