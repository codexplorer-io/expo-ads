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
    delayMs = 0,
    shouldPreload = false,
    ...requestOptions
}: UseShowRewardedAdOptions): ShowRewardedAdResult => {
    const [shouldResetAd, setShouldResetAd] = useState<boolean>(false);
    const {
        status,
        show,
        earnedReward
    } = useRewardedAd({
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

    const showRewardedAd = useCallback(async () => {
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
                    getEvents()?.adMobRewardedAdShown?.();
                    showAd();
                    setTimeout(resolve, 10);
                } else {
                    resolve();
                }
            }, currentDelay);
        })
    }, []);

    return {
        isEarnedReward: earnedReward,
        showRewardedAd
    };
};

export const useAutoShowRewardedAd = ({
    adUnitId,
    shouldShow = false,
    ...requestOptions
}: UseAutoShowRewardedAdOptions): AutoShowRewardedAdResult => {
    const {
        status,
        show,
        earnedReward
    } = useRewardedAd({
        adUnitId,
        requestOptions,
        autoLoad: shouldShow
    });

    useEffect(() => {
        if (shouldShow && status === 'loaded') {
            getEvents()?.adMobRewardedAdShown?.();
            void show();
        }
    }, [shouldShow, status, show]);

    return {
        isEarnedReward: earnedReward
    };
};
