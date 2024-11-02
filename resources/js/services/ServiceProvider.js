import AuthService from "./AuthService";
import ContentService from "./ContentService";
import UploadService from "./UploadService";
import MockAuthRepository from "../repositories/MockAuthRepository";
import MockContentRepository from "../repositories/MockContentRepository";
import MockUploadRepository from "../repositories/MockUploadRepository";
import SupabaseAuthRepository from "../repositories/supabase/SupabaseAuthRepository";
import SupabaseContentRepository from "../repositories/supabase/SupabaseContentRepository";
import SupabaseUploadRepository from "../repositories/supabase/SupabaseUploadRepository";

class ServiceProvider {
    constructor() {
        this._authService = null;
        this._contentService = null;
        this._uploadService = null;
        this._authRepository = null;
        this._contentRepository = null;
        this._uploadRepository = null;

        // Check if Supabase credentials are available
        const useSupabase =
            import.meta.env.VITE_SUPABASE_URL &&
            import.meta.env.VITE_SUPABASE_ANON_KEY;

        // Initialize with appropriate implementations
        if (useSupabase) {
            this._authRepository = new SupabaseAuthRepository();
            this._contentRepository = new SupabaseContentRepository();
            this._uploadRepository = new SupabaseUploadRepository();
        } else {
            this._authRepository = new MockAuthRepository();
            this._contentRepository = new MockContentRepository();
            this._uploadRepository = new MockUploadRepository();
        }
    }

    // Auth Service
    get authService() {
        if (!this._authService) {
            this._authService = new AuthService(this.authRepository);
        }
        return this._authService;
    }

    // Content Service
    get contentService() {
        if (!this._contentService) {
            this._contentService = new ContentService(this.contentRepository);
        }
        return this._contentService;
    }

    // Upload Service
    get uploadService() {
        if (!this._uploadService) {
            this._uploadService = new UploadService(this.uploadRepository);
        }
        return this._uploadService;
    }

    // Repositories
    get authRepository() {
        return this._authRepository;
    }

    get contentRepository() {
        return this._contentRepository;
    }

    get uploadRepository() {
        return this._uploadRepository;
    }

    // Methods to override implementations
    setAuthRepository(repository) {
        this._authRepository = repository;
        this._authService = null;
    }

    setContentRepository(repository) {
        this._contentRepository = repository;
        this._contentService = null;
    }

    setUploadRepository(repository) {
        this._uploadRepository = repository;
        this._uploadService = null;
    }
}

// Export a singleton instance
export default new ServiceProvider();
