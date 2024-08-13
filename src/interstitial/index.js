import {
    useCallback,
    useEffect
} from 'react';
import { useInterstitialAd } from 'react-native-google-mobile-ads';

export const useShowInterstitialAd = ({
    adUnitId,
    delayMs = 2000,
    shouldPreload = false,
    ...requestOptions
}) => {
    const {
        isLoaded,
        load,
        show
    } = useInterstitialAd(adUnitId, requestOptions);

    useEffect(() => {
        shouldPreload && load();
    }, [shouldPreload, load]);

    return useCallback(() => {
        setTimeout(() => {
            isLoaded && show();
        }, delayMs);
    }, [delayMs, isLoaded, show]);
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
        isLoaded && show();
    }, [isLoaded, show]);
};
