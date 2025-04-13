
class EventManager {
    constructor() {
        this.listeners = {};
    }

    // Registra um ouvinte para um evento específico
    on(eventName, listener) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(listener);
    }

    // Emite um evento com dados
    emit(eventName, data) {
        if (!this.listeners[eventName]) {
            return;
        }

        this.listeners[eventName].forEach(listener => {
            listener(data);
        });
    }

    // Remove um ouvinte específico
    off(eventName, listener) {
        if (!this.listeners[eventName]) {
            return;
        }

        this.listeners[eventName] = this.listeners[eventName].filter(l => l !== listener);
    }

    // Remove todos os ouvintes de um evento
    removeAllListeners(eventName) {
        if (eventName) {
            delete this.listeners[eventName];
        } else {
            this.listeners = {};
        }
    }
}

// Singleton para compartilhar o mesmo EventManager em toda a aplicação
const eventManager = new EventManager();

module.exports = eventManager;
