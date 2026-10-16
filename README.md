# `@codexporer.io/expo-ads`

Mobile advertising integration for React Native and Expo applications powered by `react-native-google-mobile-ads` with fallback support for custom native in-house ads, banner ads, interstitial ads, and rewarded video ads.

---

## Installation & Peer Dependencies

```bash
yarn add @codexporer.io/expo-ads
```

Peer dependencies:
- `react` (`*`)
- `react-native` (`*`)
- `react-native-google-mobile-ads` (`*`)
- `lodash` (`*`)
- `@codexporer.io/expo-device` (`*`)
- `@codexporer.io/expo-app-theme` (`*`)
- `@codexporer.io/expo-layout-state` (`*`)
- `@codexporer.io/react-hooks` (`*`)

---

## Quick Start

### 1. Consent Request on App Launch

Request user consent (GDPR / ATT) before initializing mobile ads:

```tsx
import { useEffect } from 'react';
import { requestAdsDisplayConsent } from '@codexporer.io/expo-ads';

export function App() {
  useEffect(() => {
    // Requests GDPR / ATT consent and initializes Mobile Ads SDK on iOS:
    requestAdsDisplayConsent();
  }, []);

  return <MainNavigator />;
}
```

### 2. Banner Ad

```tsx
import React from 'react';
import { View } from 'react-native';
import { BannerAd } from '@codexporer.io/expo-ads';

export function ScreenWithBanner() {
  return (
    <View style={{ flex: 1 }}>
      {/* Content */}
      <BannerAd unitId="ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy" />
    </View>
  );
}
```

### 3. Interstitial Ads

```tsx
import React from 'react';
import { Button } from '@codexporer.io/expo-button';
import { useShowInterstitialAd } from '@codexporer.io/expo-ads';

export function SaveProjectScreen({ onFinish }: { onFinish: () => void }) {
  const showInterstitial = useShowInterstitialAd({
    adUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    shouldPreload: true
  });

  const handleSave = async () => {
    await saveProject();
    showInterstitial();
    onFinish();
  };

  return <Button title="Save Project" onPress={handleSave} />;
}
```

### 4. Rewarded Ads

```tsx
import React, { useEffect } from 'react';
import { Button } from '@codexporer.io/expo-button';
import { useShowRewardedAd } from '@codexporer.io/expo-ads';

export function UnlockFilterButton({ onUnlocked }: { onUnlocked: () => void }) {
  const { isEarnedReward, showRewardedAd } = useShowRewardedAd({
    adUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    shouldPreload: true
  });

  useEffect(() => {
    if (isEarnedReward) {
      onUnlocked();
    }
  }, [isEarnedReward, onUnlocked]);

  return <Button title="Watch Ad to Unlock" onPress={showRewardedAd} />;
}
```

### 5. Native List-Item Ad with Fallback Repository

```tsx
import React from 'react';
import { View } from 'react-native';
import {
  ListItemAd,
  initializeListItemAdsRepository
} from '@codexporer.io/expo-ads';

// Initialize fallback repository with custom cross-promotion ads
initializeListItemAdsRepository([
  {
    id: 'acrobacy_promo',
    badgeText: 'Featured App',
    title: 'Acrobacy',
    label: 'Master your acrobatic skills with video analysis',
    actionText: 'Install',
    onAction: () => console.log('Acrobacy clicked'),
    isSupported: () => true
  }
]);

export function FeedScreen() {
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
Renders an adaptive or fixed Google Mobile Ads banner. Automatically reloads on iOS when returning to the foreground.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `unitId` | `string` | *Required* | AdMob banner ad unit ID (returns `null` if empty/falsy) |
| `size` | `string` | `BannerAdSize.ANCHORED_ADAPTIVE_BANNER` | Ad size preset from `react-native-google-mobile-ads` |

#### `<ListItemAd />`
Renders a native feed ad. If Google Native Ad fails to load or is loading, gracefully falls back to a supported item from the initialized local ads repository.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `RootView` | `React.ComponentType<{ children: React.ReactNode }>` | *Required* | Wrapper container component (e.g. Card or Feed Item container) |
| `adUnitId` | `string \| null` | `undefined` | AdMob native ad unit ID |
| `height` | `number` | `400` | Target container height |
| `delayMs` | `number` | `0` | Delay before rendering |

---

### Hooks

#### `useShowInterstitialAd(options)`
Returns `show(): () => void` to trigger interstitial display.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `adUnitId` | `string` | *Required* | Interstitial ad unit ID |
| `delayMs` | `number` | `0` | Delay in milliseconds before presenting the ad |
| `shouldPreload` | `boolean` | `false` | Whether to immediately preload the ad upon hook mount |
| `...requestOptions` | `RequestOptions` | `undefined` | Ad request options passed to `react-native-google-mobile-ads` |

#### `useAutoShowInterstitialAd(options)`
Automatically shows interstitial when `shouldShow` transitions to `true` and the ad is loaded.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `adUnitId` | `string` | *Required* | Interstitial ad unit ID |
| `shouldShow` | `boolean` | `false` | Trigger condition flag |
| `...requestOptions` | `RequestOptions` | `undefined` | Ad request options passed to `react-native-google-mobile-ads` |

#### `useShowRewardedAd(options)`
Returns `{ isEarnedReward: boolean, showRewardedAd: () => void }`.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `adUnitId` | `string` | *Required* | Rewarded ad unit ID |
| `delayMs` | `number` | `0` | Delay in milliseconds before presenting the ad |
| `shouldPreload` | `boolean` | `false` | Whether to preload upon mount |
| `...requestOptions` | `RequestOptions` | `undefined` | Ad request options passed to `react-native-google-mobile-ads` |

#### `useAutoShowRewardedAd(options)`
Returns `{ isEarnedReward: boolean }`. Automatically displays ad when `shouldShow` is true and ad is loaded.

---

### Helper Functions

#### `initializeListItemAdsRepository(adsRepository: LocalAdItemData[]): void`
Registers an array of local fallback ads. Supported items (`isSupported() !== false`) are randomly selected when native AdMob items are unavailable or offline.

#### `requestAdsDisplayConsent(): Promise<void>`
Requests GDPR / ATT consent and initializes the Mobile Ads SDK on iOS.

> [!NOTE]
> For Android-specific consent flows, `requestAdsDisplayConsentAndroid` is available via `@codexporer.io/expo-ads/src/display-consent`.

#### `initializeEvents(events: AdsEvents): void`
Registers global telemetry callbacks (`adMobItemRendered`, `localAdItemRendered`, `localAdItemActionExecuted`, `adMobInterstitialAdShown`, `adMobRewardedAdShown`).

---

## License

MIT
