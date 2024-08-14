let eventsBridge;

export const initializeEvents = events => {
    eventsBridge = events;
};

export const getEvents = () => eventsBridge;
