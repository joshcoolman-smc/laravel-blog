import IUploadRepository from "../interfaces/IUploadRepository";
import { createClient } from "@supabase/supabase-js";

export default class SupabaseUploadRepository extends IUploadRepository {
    constructor() {
        super();
        this.supabase = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY
        );
    }

    async uploadFile(file) {
        try {
            // Generate unique filename
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase
            const { error: uploadError } = await this.supabase.storage
                .from("content-images")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // Get the public URL
            const { data } = this.supabase.storage
                .from("content-images")
                .getPublicUrl(filePath);

            // Return the Supabase URL directly
            return data.publicUrl;
        } catch (error) {
            console.error("Upload error:", error);
            throw new Error("Failed to upload file: " + error.message);
        }
    }

    revokeObjectUrl(url) {
        // No need to revoke URLs for Supabase implementation
        // This is only needed for the mock implementation
        return;
    }
}
