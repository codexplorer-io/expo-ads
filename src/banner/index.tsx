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

interface BannerAdProps {
    unitId: string;
    size?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({
    unitId,
    size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER
}) => {
    const [shouldRenderBanner, setShouldRenderBanner] = useState<boolean>(false);
    const bannerRef = useRef<Banner | null>(null);

    useForeground(() => {
        if (OS.isIOS()) {
            bannerRef.current?.load();
        }
    });

    useEffect(() => {
        setShouldRenderBanner(Boolean(unitId));

        return () => {
            setShouldRenderBanner(false);
        };
    }, [unitId]);

    if (!shouldRenderBanner) {
        return null;
    }

    return (
        <Banner
            ref={bannerRef}
            unitId={unitId}
            size={size}
        />
    );
};
