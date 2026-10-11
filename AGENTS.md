# AGENTS.md — `@codexporer.io/expo-ads`

## Package Overview
Google Mobile Ads integration (`react-native-google-mobile-ads`) supporting adaptive banners, native feed ads with offline/local fallbacks, interstitials, and rewarded ads.

## Key Exports
- `BannerAd`: Component rendering adaptive banner ad.
- `ListItemAd`: Native ad item wrapper falling back to local ad items when offline/loading.
- `initializeListItemAdsRepository(repo)`: Registers local fallback ad items.
- `useShowInterstitialAd({ adUnitId, delayMs, shouldPreload })`: Hook returning `show()` function.
- `useAutoShowInterstitialAd({ adUnitId, shouldShow })`: Hook triggering interstitial on boolean flag.
- `useShowRewardedAd({ adUnitId, delayMs, shouldPreload })`: Hook returning `{ isEarnedReward, showRewardedAd }`.
- `useAutoShowRewardedAd({ adUnitId, shouldShow })`: Hook returning `{ isEarnedReward }`.
- `requestAdsDisplayConsent()`: Handles consent form updates and SDK initialization.
- `initializeEvents(events)`: Hooks up analytics/telemetry for ad impressions and clicks.

## Critical Guidelines for AI Agents
- **Preloading**: Always pass `shouldPreload: true` to `useShowInterstitialAd` or `useShowRewardedAd` when an ad will be shown on a subsequent user action to avoid latency.
- **Rewarded Ad Lifecycle**: Watch `isEarnedReward` from `useShowRewardedAd` inside `useEffect` to safely award benefits; do not assume the reward is granted immediately upon invocation.
- **Empty Ad Unit Protection**: If `unitId` is null or undefined, `<BannerAd />` renders `null` safely without throwing.
- **Consent Initialization**: Call `requestAdsDisplayConsent()` in root app component before requesting ads in production.
- **Theming**: Native ad cards derive surface, text, and border styling from `useAppTheme()`. Do not hardcode container colors.
