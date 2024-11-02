export default class IUploadService {
    async uploadFile(file) {
        throw new Error("uploadFile method must be implemented");
    }

    revokeObjectUrl(url) {
        throw new Error("revokeObjectUrl method must be implemented");
    }
}
