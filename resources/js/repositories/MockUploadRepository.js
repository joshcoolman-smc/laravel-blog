import IUploadRepository from "./interfaces/IUploadRepository";

export default class MockUploadRepository extends IUploadRepository {
    constructor() {
        super();
        this.uploadedFiles = new Map();
        // Store object URLs to prevent garbage collection
        this.objectUrls = new Map();
    }

    async uploadFile(file) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Create a blob URL for the file
        const objectUrl = URL.createObjectURL(file);

        // Store the file data and object URL
        const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date(),
            url: objectUrl,
        };

        // Generate a unique ID for the file
        const fileId = Date.now().toString();
        this.uploadedFiles.set(fileId, fileData);
        this.objectUrls.set(fileId, objectUrl);

        return objectUrl;
    }

    // Clean up object URLs when they're no longer needed
    revokeObjectUrl(url) {
        for (const [fileId, storedUrl] of this.objectUrls.entries()) {
            if (storedUrl === url) {
                URL.revokeObjectURL(url);
                this.objectUrls.delete(fileId);
                this.uploadedFiles.delete(fileId);
                break;
            }
        }
    }
}
