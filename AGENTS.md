# AGENTS.md — `@codexporer.io/expo-ads`

## Package Overview
Google Mobile Ads integration (`react-native-google-mobile-ads`) supporting adaptive banners, native feed ads with offline/local fallbacks, interstitials, and rewarded ads.

## Peer Dependencies
All of the following are required peer dependencies:
- `react`: `*`
- `react-native`: `*`
- `react-native-google-mobile-ads`: `*`
- `lodash`: `*`
- `@codexporer.io/expo-device`: `*`
- `@codexporer.io/expo-app-theme`: `*`
- `@codexporer.io/expo-layout-state`: `*`
- `@codexporer.io/react-hooks`: `*`

## Key Exports
- `BannerAd`: Component rendering adaptive banner ad.
- `ListItemAd`: Native ad item wrapper falling back to local ad items when offline/loading.
- `initializeListItemAdsRepository(repo)`: Registers local fallback ad items (`LocalAdItemData[]`).
- `useShowInterstitialAd({ adUnitId, delayMs, shouldPreload, ...requestOptions })`: Hook returning `show()` function.
- `useAutoShowInterstitialAd({ adUnitId, shouldShow, ...requestOptions })`: Hook triggering interstitial on boolean flag.
- `useShowRewardedAd({ adUnitId, delayMs, shouldPreload, ...requestOptions })`: Hook returning `{ isEarnedReward, showRewardedAd }`.
- `useAutoShowRewardedAd({ adUnitId, shouldShow, ...requestOptions })`: Hook returning `{ isEarnedReward }`.
- `requestAdsDisplayConsent()`: Handles GDPR / ATT consent and Mobile Ads initialization on iOS. (Android-specific consent helper `requestAdsDisplayConsentAndroid()` is available via `@codexporer.io/expo-ads/src/display-consent`).
- `initializeEvents(events)`: Hooks up analytics/telemetry for ad impressions and clicks.

## Critical Guidelines for AI Agents
- **Preloading**: Always pass `shouldPreload: true` to `useShowInterstitialAd` or `useShowRewardedAd` when an ad will be shown on a subsequent user action to avoid latency.
- **Rewarded Ad Lifecycle**: Watch `isEarnedReward` from `useShowRewardedAd` inside `useEffect` to safely award benefits; do not assume the reward is granted immediately upon invocation.
- **Empty Ad Unit Protection**: If `unitId` is null or undefined, `<BannerAd />` renders `null` safely without throwing.
- **Consent Initialization**: Call `requestAdsDisplayConsent()` in the root app component before requesting ads in production.
- **Fallback Repository**: When using `<ListItemAd />`, always call `initializeListItemAdsRepository(...)` at app startup to ensure fallback cards are available if native ads fail to load or the device is offline.
- **Theming**: Native ad cards derive surface, text, and border styling from `useAppTheme()`. Do not hardcode container colors.
