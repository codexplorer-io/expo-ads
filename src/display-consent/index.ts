import mobileAds, {
    AdsConsent
} from 'react-native-google-mobile-ads';
import { OS } from '@codexporer.io/expo-device';

const requestConsentDisplay = async (): Promise<void> => {
    try {
        await AdsConsent.requestInfoUpdate();
        const adsConsentInfo = await AdsConsent.loadAndShowConsentFormIfRequired();
        if (adsConsentInfo.canRequestAds) {
            await mobileAds().initialize();
        }
    } catch (error) {
        console.log('Error during requesting ads permissions.');
        console.error(error);
    }
};

export const requestAdsDisplayConsent = async (): Promise<void> => {
    if (!OS.isAndroid()) {
        await requestConsentDisplay();
    }
};

export const requestAdsDisplayConsentAndroid = async (): Promise<void> => {
    if (OS.isAndroid()) {
        await requestConsentDisplay();
    }
};
