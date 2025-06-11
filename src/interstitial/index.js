import {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { useInterstitialAd } from 'react-native-google-mobile-ads';
import { getEvents } from '../events';

export const useShowInterstitialAd = ({
    adUnitId,
    delayMs = 2000,
    shouldPreload = false,
    ...requestOptions
}) => {
    const [shouldResetAd, setShouldResetAd] = useState(false);
    const {
        isLoaded,
        isOpened,
        load,
        show
    } = useInterstitialAd(
        shouldResetAd ? undefined : adUnitId,
        requestOptions
    );

    useEffect(() => {
        !shouldResetAd && shouldPreload && load();
    }, [shouldResetAd, shouldPreload, load]);

    useEffect(() => {
        shouldResetAd && setShouldResetAd(false);
    }, [shouldResetAd]);

    const callbackRef = useRef();
    callbackRef.current = {
        isLoaded,
        isOpened,
        show,
        delayMs
    };

    return useCallback(() => {
        const { delayMs } = callbackRef.current;
        setTimeout(() => {
            const {
                isLoaded,
                isOpened,
                show
            } = callbackRef.current;
            if (!isOpened && isLoaded) {
                setShouldResetAd(true);
                getEvents()?.adMobInterstitialAdShown?.();
                show();
            }
        }, delayMs);
    }, []);
};

export const useAutoShowInterstitialAd = ({
    adUnitId,
    shouldShow = false,
    ...requestOptions
}) => {
    const {
        isLoaded,
        load,
        show
    } = useInterstitialAd(adUnitId, requestOptions);

    useEffect(() => {
        shouldShow && load();
    }, [shouldShow, load]);

    useEffect(() => {
        if (isLoaded) {
            getEvents()?.adMobInterstitialAdShown?.();
            show();
        }
    }, [isLoaded, show]);
};
