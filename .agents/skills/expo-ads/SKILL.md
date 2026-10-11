---
name: expo-ads
description: Instructions and guidelines for using @codexporer.io/expo-ads (Expo Ads) in React Native and Expo applications.
---

# `@codexporer.io/expo-ads` Skill

## Overview
`@codexporer.io/expo-ads` is a production ads module wrapping `react-native-google-mobile-ads`. It provides adaptive banners, interstitials, rewarded video ads, and native list-item ads that seamlessly fall back to local in-house cross-promotion ads.

---

## When to Use
- Displaying bottom or top banner ads in screens (`<BannerAd />`).
- Triggering full-screen interstitials after completing user workflows (`useShowInterstitialAd`).
- Unlocking premium features or additional exports via rewarded video ads (`useShowRewardedAd`).
- Embedding sponsored cards in FlashList or FlatList feeds (`<ListItemAd />`).

---

## Usage Examples

### Interstitial Ad on Workflow Completion

```tsx
import React from 'react';
import { View } from 'react-native';
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

### Rewarded Ad for Unlocking Features

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

---

## API Reference

### Components

#### `<BannerAd />`
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `unitId` | `string` | *Required* | AdMob banner unit ID |
| `size` | `string` | `ANCHORED_ADAPTIVE_BANNER` | Banner size string |

#### `<ListItemAd />`
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `RootView` | `React.ComponentType<{ children?: ReactNode }>` | *Required* | Container wrapper element |
| `adUnitId` | `string` | *Required* | AdMob native ad unit ID |
| `height` | `number` | `400` | Target item height |

### Hooks

#### `useShowInterstitialAd(options)`
Returns `show(): () => void`.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `adUnitId` | `string` | *Required* | Interstitial ad unit ID |
| `delayMs` | `number` | `0` | Delay before showing |
| `shouldPreload` | `boolean` | `false` | Whether to preload ad upon mount |

#### `useShowRewardedAd(options)`
Returns `{ isEarnedReward: boolean, showRewardedAd: () => void }`.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `adUnitId` | `string` | *Required* | Rewarded ad unit ID |
| `delayMs` | `number` | `0` | Delay before showing |
| `shouldPreload` | `boolean` | `false` | Preload flag |

---

## Critical Rules & Guidelines

1. **Preload Before Action**: Set `shouldPreload: true` in `useShowInterstitialAd` / `useShowRewardedAd` so ads load in the background before users press the trigger button.
2. **Rewarded Completion Callback**: Never grant the reward immediately when calling `showRewardedAd()`. Listen for `isEarnedReward` to become `true` via `useEffect`.
3. **Fallback Repository**: When using `<ListItemAd />`, always call `initializeListItemAdsRepository(...)` at app startup to ensure fallback cards are available if native ads fail to load or the device is offline.
