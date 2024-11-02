import IContentRepository from "../interfaces/IContentRepository";
import { createClient } from "@supabase/supabase-js";

export default class SupabaseContentRepository extends IContentRepository {
    constructor() {
        super();
        this.supabase = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY
        );
    }

    async findAll() {
        const { data, error } = await this.supabase
            .from("content")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }

    async findById(id) {
        const { data, error } = await this.supabase
            .from("content")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async create(content) {
        // Get the current user
        const {
            data: { user },
            error: userError,
        } = await this.supabase.auth.getUser();
        if (userError) throw userError;

        // Add user_id to the content
        const contentWithUser = {
            ...content,
            user_id: user.id,
        };

        const { data, error } = await this.supabase
            .from("content")
            .insert([contentWithUser])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async update(id, content) {
        // Get the current user
        const {
            data: { user },
            error: userError,
        } = await this.supabase.auth.getUser();
        if (userError) throw userError;

        // Add user_id to the content
        const contentWithUser = {
            ...content,
            user_id: user.id,
        };

        const { data, error } = await this.supabase
            .from("content")
            .update(contentWithUser)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async delete(id) {
        const { error } = await this.supabase
            .from("content")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    }
}
