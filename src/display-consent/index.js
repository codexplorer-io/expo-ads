import mobileAds, {
    AdsConsent
} from 'react-native-google-mobile-ads';

export const requestAdsDisplayConsent = async () => {
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
