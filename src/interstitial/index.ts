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
    delayMs = 0,
    shouldPreload = false,
    ...requestOptions
}: UseShowInterstitialAdOptions): (() => void) => {
    const [shouldResetAd, setShouldResetAd] = useState<boolean>(false);
    const {
        status,
        show
    } = useInterstitialAd({
        adUnitId: shouldResetAd ? null : adUnitId,
        requestOptions,
        autoLoad: shouldPreload && !shouldResetAd
    });

    useEffect(() => {
        if (shouldResetAd) {
            setShouldResetAd(false);
        }
    }, [shouldResetAd]);

    const isLoaded = status === 'loaded';
    const isOpened = status === 'showing' || status === 'closed';

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

    return useCallback(async () => {
        const currentDelay = callbackRef.current.delayMs;
        return new Promise<void>(resolve => {
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
                    setTimeout(resolve, 10);
                } else {
                    resolve();
                }
            }, currentDelay)
        });
    }, []);
};

export const useAutoShowInterstitialAd = ({
    adUnitId,
    shouldShow = false,
    ...requestOptions
}: UseAutoShowInterstitialAdOptions): void => {
    const {
        status,
        show
    } = useInterstitialAd({
        adUnitId,
        requestOptions,
        autoLoad: shouldShow
    });

    useEffect(() => {
        if (shouldShow && status === 'loaded') {
            getEvents()?.adMobInterstitialAdShown?.();
            show();
        }
    }, [shouldShow, status, show]);
};
