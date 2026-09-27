import {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { useRewardedAd } from 'react-native-google-mobile-ads';
import { getEvents } from '../events';

export const useShowRewardedAd = ({
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
        show,
        isEarnedReward
    } = useRewardedAd(
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

    const showRewardedAd = useCallback(() => {
        const { delayMs } = callbackRef.current;
        setTimeout(() => {
            const {
                isLoaded,
                isOpened,
                show
            } = callbackRef.current;
            if (!isOpened && isLoaded) {
                setShouldResetAd(true);
                getEvents()?.adMobRewardedAdShown?.();
                show();
            }
        }, delayMs);
    }, []);

    return {
        isEarnedReward,
        showRewardedAd
    };
};

export const useAutoShowRewardedAd = ({
    adUnitId,
    shouldShow = false,
    ...requestOptions
}) => {
    const {
        isLoaded,
        load,
        show,
        isEarnedReward
    } = useRewardedAd(adUnitId, requestOptions);

    useEffect(() => {
        shouldShow && load();
    }, [shouldShow, load]);

    useEffect(() => {
        if (isLoaded) {
            getEvents()?.adMobRewardedAdShown?.();
            show();
        }
    }, [isLoaded, show]);

    return {
        isEarnedReward
    };
};
