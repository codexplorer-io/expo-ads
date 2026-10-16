---
name: expo-ads
description: Instructions and guidelines for using @codexporer.io/expo-ads (Expo Ads) in React Native and Expo applications.
---

# `@codexporer.io/expo-ads` Skill

## Overview
`@codexporer.io/expo-ads` is a production mobile advertising module wrapping `react-native-google-mobile-ads`. It provides adaptive banners, interstitials, rewarded video ads, and native list-item ads that seamlessly fall back to local in-house cross-promotion ads.

---

## When to Use
- Displaying bottom or top banner ads in screens (`<BannerAd />`).
- Triggering full-screen interstitials after completing user workflows (`useShowInterstitialAd`, `useAutoShowInterstitialAd`).
- Unlocking premium features or additional exports via rewarded video ads (`useShowRewardedAd`, `useAutoShowRewardedAd`).
- Embedding sponsored cards in FlashList or FlatList feeds (`<ListItemAd />`).
- Requesting GDPR / ATT consent before loading ads on iOS (`requestAdsDisplayConsent`).

---

## Peer Dependencies
All of the following peer dependencies must be installed in the consuming project:
- `react`: `*`
- `react-native`: `*`
- `react-native-google-mobile-ads`: `*`
- `lodash`: `*`
- `@codexporer.io/expo-device`: `*`
- `@codexporer.io/expo-app-theme`: `*`
- `@codexporer.io/expo-layout-state`: `*`
- `@codexporer.io/react-hooks`: `*`

---

## Installation & Setup

```bash
yarn add @codexporer.io/expo-ads
```

---

## Usage Examples

### 1. Requesting Ad Consent
Request consent at application startup before loading ads:

```tsx
import React, { useEffect } from 'react';
import { requestAdsDisplayConsent } from '@codexporer.io/expo-ads';

export function RootApp() {
  useEffect(() => {
    // Requests GDPR / ATT consent and initializes Mobile Ads on iOS:
    requestAdsDisplayConsent();
  }, []);

  return <NavigationRoot />;
}
```

### 2. Interstitial Ad on Workflow Completion

```tsx
import React from 'react';
import { Button } from '@codexporer.io/expo-button';
import { useShowInterstitialAd } from '@codexporer.io/expo-ads';

export function ExportScreen({ onComplete }: { onComplete: () => void }) {
  const showInterstitial = useShowInterstitialAd({
    adUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    shouldPreload: true
  });

  const handleExport = async () => {
    await renderMedia();
    showInterstitial();
    onComplete();
  };

  return <Button title="Export Project" onPress={handleExport} />;
}
```

### 3. Rewarded Ad for Unlocking Features

```tsx
import React, { useEffect } from 'react';
import { Button } from '@codexporer.io/expo-button';
import { useShowRewardedAd } from '@codexporer.io/expo-ads';

export function UnlockPresetButton({ onUnlocked }: { onUnlocked: () => void }) {
  const { isEarnedReward, showRewardedAd } = useShowRewardedAd({
    adUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    shouldPreload: true
  });

  useEffect(() => {
    if (isEarnedReward) {
      onUnlocked();
    }
  }, [isEarnedReward, onUnlocked]);

  return <Button title="Watch Ad to Unlock Preset" onPress={showRewardedAd} />;
}
```

### 4. Feed Native Item with Fallback Ads

```tsx
import React from 'react';
import { View } from 'react-native';
import {
  ListItemAd,
  initializeListItemAdsRepository
} from '@codexporer.io/expo-ads';

// Initialize fallback repository at app bootstrap
initializeListItemAdsRepository([
  {
    id: 'promo_1',
    badgeText: 'Featured',
    title: 'Captifly Pro',
    label: 'Unlock 4K export and unlimited clips',
    actionText: 'Learn More',
    onAction: () => console.log('Promo pressed'),
    isSupported: () => true
  }
]);

export function FeedList() {
  return (
    <ListItemAd
      RootView={({ children }) => <View style={{ marginVertical: 8 }}>{children}</View>}
      adUnitId="ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"
      height={380}
    />
  );
}
```

---

## API Reference

### Components

#### `<BannerAd />`
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `unitId` | `string` | *Required* | AdMob banner unit ID (renders `null` if empty/falsy) |
| `size` | `string` | `ANCHORED_ADAPTIVE_BANNER` | Banner size preset from `react-native-google-mobile-ads` |

#### `<ListItemAd />`
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `RootView` | `React.ComponentType<{ children: ReactNode }>` | *Required* | Container wrapper element |
| `adUnitId` | `string \| null` | `undefined` | AdMob native ad unit ID |
| `height` | `number` | `400` | Target item height |
| `delayMs` | `number` | `0` | Delay before rendering |

### Hooks

#### `useShowInterstitialAd(options)`
Returns `show(): () => void`.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `adUnitId` | `string` | *Required* | Interstitial ad unit ID |
| `delayMs` | `number` | `0` | Delay before showing |
| `shouldPreload` | `boolean` | `false` | Whether to preload ad upon mount |
| `...requestOptions` | `RequestOptions` | `undefined` | Additional ad request options |

#### `useAutoShowInterstitialAd(options)`
Automatically shows interstitial when `shouldShow` is `true` and ad is loaded.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `adUnitId` | `string` | *Required* | Interstitial ad unit ID |
| `shouldShow` | `boolean` | `false` | Trigger condition |

#### `useShowRewardedAd(options)`
Returns `{ isEarnedReward: boolean, showRewardedAd: () => void }`.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `adUnitId` | `string` | *Required* | Rewarded ad unit ID |
| `delayMs` | `number` | `0` | Delay before showing |
| `shouldPreload` | `boolean` | `false` | Preload flag |

#### `useAutoShowRewardedAd(options)`
Returns `{ isEarnedReward: boolean }`.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `adUnitId` | `string` | *Required* | Rewarded ad unit ID |
| `shouldShow` | `boolean` | `false` | Trigger condition |

### Helper Functions

- `requestAdsDisplayConsent(): Promise<void>`: Requests consent and initializes Mobile Ads on iOS. (Note: `requestAdsDisplayConsentAndroid` is available via `@codexporer.io/expo-ads/src/display-consent` if needed for Android-specific consent flows).
- `initializeListItemAdsRepository(adsRepository: LocalAdItemData[]): void`: Registers local fallback ad items.
- `initializeEvents(events: AdsEvents): void`: Registers ad lifecycle telemetry listeners.

---

## Critical Rules & Guidelines

1. **Preload Before Action**: Set `shouldPreload: true` in `useShowInterstitialAd` / `useShowRewardedAd` so ads load in the background before users press the trigger button.
2. **Rewarded Completion Callback**: Never grant the reward immediately when calling `showRewardedAd()`. Listen for `isEarnedReward` to become `true` via `useEffect`.
3. **Fallback Repository**: When using `<ListItemAd />`, always call `initializeListItemAdsRepository(...)` at app startup to ensure fallback cards are available if native ads fail to load or the device is offline.
4. **Consent Request**: Call `requestAdsDisplayConsent()` at application startup before ad requests.
5. **Theming**: Native card styles in `<ListItemAd />` automatically derive colors from `useAppTheme()`.
