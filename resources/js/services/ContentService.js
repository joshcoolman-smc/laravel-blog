import IContentService from "./interfaces/IContentService";

export default class ContentService extends IContentService {
    constructor(repository) {
        super();
        this.repository = repository;
    }

    async findAll() {
        return await this.repository.findAll();
    }

    async findById(id) {
        return await this.repository.findById(id);
    }

    async create(data) {
        return await this.repository.create(data);
    }

    async update(id, data) {
        return await this.repository.update(id, data);
    }

    async delete(id) {
        return await this.repository.delete(id);
    }
}
