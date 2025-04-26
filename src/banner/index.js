import React, {
    useEffect,
    useRef,
    useState
} from 'react';
import { OS } from '@codexporer.io/expo-device';
import {
    BannerAd as Banner,
    BannerAdSize,
    useForeground
} from 'react-native-google-mobile-ads';

export const BannerAd = ({ unitId }) => {
    const [shouldRenderBanner, setShouldRenderBanner] = useState(false);
    const bannerRef = useRef(null);

    useForeground(() => {
        OS.isIOS() && bannerRef.current?.load();
    });

    useEffect(() => {
        setShouldRenderBanner(!!unitId);

        return () => {
            setShouldRenderBanner(false);
        };
    }, [unitId]);

    return shouldRenderBanner && (
        <Banner
            ref={bannerRef}
            unitId={unitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
    );
};
