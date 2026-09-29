import {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { useInterstitialAd, type RequestOptions } from 'react-native-google-mobile-ads';
import { getEvents } from '../events';

interface UseShowInterstitialAdOptions extends RequestOptions {
    adUnitId: string;
    delayMs?: number;
    shouldPreload?: boolean;
}

interface UseAutoShowInterstitialAdOptions extends RequestOptions {
    adUnitId: string;
    shouldShow?: boolean;
}

interface CallbackRefState {
    isLoaded: boolean;
    isOpened: boolean;
    show: () => void;
    delayMs: number;
}

export const useShowInterstitialAd = ({
    adUnitId,
    delayMs = 2000,
    shouldPreload = false,
    ...requestOptions
}: UseShowInterstitialAdOptions): (() => void) => {
    const [shouldResetAd, setShouldResetAd] = useState<boolean>(false);
    const {
        isLoaded,
        isOpened,
        load,
        show
    } = useInterstitialAd(
        shouldResetAd ? null : adUnitId,
        requestOptions
    );

    useEffect(() => {
        if (!shouldResetAd && shouldPreload) {
            load();
        }
    }, [shouldResetAd, shouldPreload, load]);

    useEffect(() => {
        if (shouldResetAd) {
            setShouldResetAd(false);
        }
    }, [shouldResetAd]);

    const callbackRef = useRef<CallbackRefState>({
        isLoaded,
        isOpened,
        show,
        delayMs
    });
    callbackRef.current = {
        isLoaded,
        isOpened,
        show,
        delayMs
    };

    return useCallback((): void => {
        const currentDelay = callbackRef.current.delayMs;
        setTimeout(() => {
            const {
                isLoaded: loaded,
                isOpened: opened,
                show: showAd
            } = callbackRef.current;
            if (!opened && loaded) {
                setShouldResetAd(true);
                getEvents()?.adMobInterstitialAdShown?.();
                showAd();
            }
        }, currentDelay);
    }, []);
};

export const useAutoShowInterstitialAd = ({
    adUnitId,
    shouldShow = false,
    ...requestOptions
}: UseAutoShowInterstitialAdOptions): void => {
    const {
        isLoaded,
        load,
        show
    } = useInterstitialAd(adUnitId, requestOptions);

    useEffect(() => {
        if (shouldShow) {
            load();
        }
    }, [shouldShow, load]);

    useEffect(() => {
        if (isLoaded) {
            getEvents()?.adMobInterstitialAdShown?.();
            show();
        }
    }, [isLoaded, show]);
};
