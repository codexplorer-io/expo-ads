import mobileAds, {
    AdsConsent
} from 'react-native-google-mobile-ads';
import { OS } from '@codexporer.io/expo-device';

const requestConsentDisplay = async () => {
    try {
        await AdsConsent.requestInfoUpdate();
        const adsConsentInfo = await AdsConsent.loadAndShowConsentFormIfRequired();
        if (adsConsentInfo.canRequestAds) {
            await mobileAds().initialize();
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error during requesting ads permissions.');
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

export const requestAdsDisplayConsent = async () => {
    if (!OS.isAndroid()) {
        await requestConsentDisplay();
    }
};

export const requestAdsDisplayConsentAndroid = async () => {
    if (OS.isAndroid()) {
        await requestConsentDisplay();
    }
};
