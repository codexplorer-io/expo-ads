import type { LocalAdItemData } from '../list-item';

interface AdsEvents {
    adMobItemRendered?: () => void;
    localAdItemRendered?: (item?: LocalAdItemData) => void;
    localAdItemActionExecuted?: (item?: LocalAdItemData) => void;
    adMobInterstitialAdShown?: () => void;
    adMobRewardedAdShown?: () => void;
}

let eventsBridge: AdsEvents | undefined;

export const initializeEvents = (events: AdsEvents): void => {
    eventsBridge = events;
};

export const getEvents = (): AdsEvents | undefined => eventsBridge;
