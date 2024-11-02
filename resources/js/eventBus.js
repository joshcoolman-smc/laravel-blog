import { ref } from "vue";

const bus = {
    emit(event, ...args) {
        if (!this.callbacks[event]) return;

        this.callbacks[event].forEach((callback) => callback(...args));
    },

    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }

        this.callbacks[event].push(callback);
    },

    callbacks: {},
};

export default bus;
