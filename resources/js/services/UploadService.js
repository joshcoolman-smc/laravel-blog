import IUploadService from "./interfaces/IUploadService";

export default class UploadService extends IUploadService {
    constructor(repository) {
        super();
        this.repository = repository;
    }

    async uploadFile(file) {
        try {
            return await this.repository.uploadFile(file);
        } catch (error) {
            console.error("Upload error:", error);
            throw new Error(error.message || "Failed to upload file");
        }
    }

    revokeObjectUrl(url) {
        try {
            this.repository.revokeObjectUrl(url);
        } catch (error) {
            console.error("Revoke URL error:", error);
        }
    }
}
