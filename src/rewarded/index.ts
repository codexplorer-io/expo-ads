import {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { useRewardedAd, type RequestOptions } from 'react-native-google-mobile-ads';
import { getEvents } from '../events';

interface UseShowRewardedAdOptions extends RequestOptions {
    adUnitId: string;
    delayMs?: number;
    shouldPreload?: boolean;
}

interface ShowRewardedAdResult {
    isEarnedReward: boolean;
    showRewardedAd: () => void;
}

interface UseAutoShowRewardedAdOptions extends RequestOptions {
    adUnitId: string;
    shouldShow?: boolean;
}

interface AutoShowRewardedAdResult {
    isEarnedReward: boolean;
}

interface CallbackRefState {
    isLoaded: boolean;
    isOpened: boolean;
    show: () => void;
    delayMs: number;
}

export const useShowRewardedAd = ({
    adUnitId,
    delayMs = 2000,
    shouldPreload = false,
    ...requestOptions
}: UseShowRewardedAdOptions): ShowRewardedAdResult => {
    const [shouldResetAd, setShouldResetAd] = useState<boolean>(false);
    const {
        isLoaded,
        isOpened,
        load,
        show,
        isEarnedReward
    } = useRewardedAd(
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

    const showRewardedAd = useCallback((): void => {
        const currentDelay = callbackRef.current.delayMs;
        setTimeout(() => {
            const {
                isLoaded: loaded,
                isOpened: opened,
                show: showAd
            } = callbackRef.current;
            if (!opened && loaded) {
                setShouldResetAd(true);
                getEvents()?.adMobRewardedAdShown?.();
                showAd();
            }
        }, currentDelay);
    }, []);

    return {
        isEarnedReward: isEarnedReward ?? false,
        showRewardedAd
    };
};

export const useAutoShowRewardedAd = ({
    adUnitId,
    shouldShow = false,
    ...requestOptions
}: UseAutoShowRewardedAdOptions): AutoShowRewardedAdResult => {
    const {
        isLoaded,
        load,
        show,
        isEarnedReward
    } = useRewardedAd(adUnitId, requestOptions);

    useEffect(() => {
        if (shouldShow) {
            load();
        }
    }, [shouldShow, load]);

    useEffect(() => {
        if (isLoaded) {
            getEvents()?.adMobRewardedAdShown?.();
            show();
        }
    }, [isLoaded, show]);

    return {
        isEarnedReward: isEarnedReward ?? false
    };
};
