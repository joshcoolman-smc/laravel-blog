import IContentRepository from "./interfaces/IContentRepository";

export default class MockContentRepository extends IContentRepository {
    constructor() {
        super();
        this.mockData = [
            {
                id: 1,
                title: "Mountain Adventure",
                description:
                    "Explore the majestic peaks and breathtaking views of the mountain ranges.",
                image: "https://picsum.photos/id/1018/800/600",
                content:
                    "<h1>Mountain Adventure</h1><p>Nestled high in the rugged terrain, these magnificent mountains offer an unforgettable experience for adventurers and nature lovers alike. With trails ranging from beginner-friendly paths to challenging ascents, every explorer will find their perfect route to adventure.</p>",
            },
            {
                id: 2,
                title: "Ocean Serenity",
                description:
                    "Experience the calming waves and peaceful beaches of the coastline.",
                image: "https://picsum.photos/id/1015/800/600",
                content:
                    "<h1>Ocean Serenity</h1><p>The rhythmic sounds of waves meeting the shore create a perfect backdrop for relaxation and contemplation. Our coastal paradise features pristine beaches, hidden coves, and spectacular ocean views that will rejuvenate your spirit.</p>",
            },
            {
                id: 3,
                title: "Forest Mystery",
                description:
                    "Discover the hidden wonders within the ancient forest trails.",
                image: "https://picsum.photos/id/1019/800/600",
                content:
                    "<h1>Forest Mystery</h1><p>Ancient trees tower overhead as you explore winding paths through this mystical forest. Every turn reveals new discoveries, from rare wildlife to stunning natural formations, making each visit a unique adventure.</p>",
            },
        ];
    }

    async findAll() {
        return [...this.mockData];
    }

    async findById(id) {
        const item = this.mockData.find((item) => item.id === parseInt(id));
        if (!item) {
            throw new Error("Content not found");
        }
        return { ...item };
    }

    async create(data) {
        const newId = Math.max(...this.mockData.map((item) => item.id)) + 1;
        const newItem = { ...data, id: newId };
        this.mockData.push(newItem);
        return { ...newItem };
    }

    async update(id, data) {
        const index = this.mockData.findIndex(
            (item) => item.id === parseInt(id)
        );
        if (index === -1) {
            throw new Error("Content not found");
        }
        this.mockData[index] = { ...this.mockData[index], ...data };
        return { ...this.mockData[index] };
    }

    async delete(id) {
        const index = this.mockData.findIndex(
            (item) => item.id === parseInt(id)
        );
        if (index === -1) {
            throw new Error("Content not found");
        }
        this.mockData.splice(index, 1);
        return true;
    }
}
