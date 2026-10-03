import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    type LayoutChangeEvent,
    type ImageProps
} from 'react-native';
import filter from 'lodash/filter';
import sample from 'lodash/sample';
import { useDimensions } from '@codexporer.io/react-hooks';
import { useLayout } from '@codexporer.io/expo-layout-state';
import { useAppTheme } from '@codexporer.io/expo-app-theme';
import {
    NativeAd,
    NativeAdView,
    NativeAsset,
    NativeAssetType,
    NativeMediaAspectRatio,
    NativeMediaView
} from 'react-native-google-mobile-ads';
import { getEvents } from '../events';

const MEDIA_TOP_MARGIN = 10;
const TOP_PADDING = 40;

const VerticalSpacer: React.FC<{ size?: number }> = ({ size = 10 }) => (
    <View style={{ height: size }} />
);
const HorizontalSpacer: React.FC<{ size?: number }> = ({ size = 10 }) => (
    <View style={{ width: size }} />
);

interface ContentProps {
    children: React.ReactNode;
    onLayout?: (event: LayoutChangeEvent) => void;
    height?: number;
}

const Content: React.FC<ContentProps> = ({ children, onLayout, height }) => (
    <View style={[styles.content, { height }]} onLayout={onLayout}>
        {children}
    </View>
);

interface ContentRowProps {
    children: React.ReactNode;
    onLayout?: (event: LayoutChangeEvent) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ children, onLayout }) => (
    <View style={styles.contentRow} onLayout={onLayout}>
        {children}
    </View>
);

const ContentColumn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <View style={styles.contentColumn}>
        {children}
    </View>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useAppTheme();
    const primaryColor = theme.primary;
    return (
        <Text style={[styles.badge, { borderColor: primaryColor, color: primaryColor }]}>
            {children}
        </Text>
    );
};

interface TextAssetProps {
    children: React.ReactNode;
}

const LocalAdTitle: React.FC<TextAssetProps> = ({ children }) => {
    const theme = useAppTheme();
    const textColor = theme.text;
    return (
        <Text style={[styles.title, { color: textColor }]}>
            {children}
        </Text>
    );
};

const LocalAdLabel: React.FC<TextAssetProps> = ({ children }) => {
    const theme = useAppTheme();
    const placeholderColor = theme.text;
    return (
        <Text style={[styles.label, { color: placeholderColor }]}>
            {children}
        </Text>
    );
};

const LocalAdAdvertiser: React.FC<TextAssetProps> = ({ children }) => {
    const theme = useAppTheme();
    const textColor = theme.text;
    return (
        <Text style={[styles.advertiser, { color: textColor }]}>
            {children}
        </Text>
    );
};

const MediaWrapper: React.FC<{ children: React.ReactNode; height?: number }> = ({ children, height }) => (
    <View style={[styles.mediaWrapper, height ? { height } : undefined]}>
        {children}
    </View>
);

const LocalAdImage: React.FC<ImageProps> = (props) => (
    <Image style={styles.absoluteFill} {...props} />
);
const LocalAdIcon: React.FC<ImageProps> = (props) => (
    <Image style={styles.icon} {...props} />
);

interface ActionRowProps {
    children: React.ReactNode;
    onLayout?: (event: LayoutChangeEvent) => void;
}

const ActionRow: React.FC<ActionRowProps> = ({ children, onLayout }) => (
    <View style={styles.actionRow} onLayout={onLayout}>
        {children}
    </View>
);

interface LocalAdActionProps {
    children: React.ReactNode;
    onPress: () => void;
}

const LocalAdActionButton: React.FC<LocalAdActionProps> = ({ children, onPress }) => {
    const theme = useAppTheme();
    const primaryColor = theme.primary;
    const onPrimaryColor = theme.background;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.actionButton, { backgroundColor: primaryColor }]}
        >
            <Text style={[styles.actionText, { color: onPrimaryColor }]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

interface LocalAdAction {
    title: string;
    execute: () => void;
}

export interface LocalAdItemData {
    iconUrl?: string;
    title: string;
    description?: string;
    advertiser?: string;
    imageUrl?: string;
    action?: LocalAdAction;
    isSupported?: () => boolean;
}

let listItemAdsRepository: LocalAdItemData[] = [];
export const initializeListItemAdsRepository = (adsRepository: LocalAdItemData[]): void => {
    listItemAdsRepository = filter(adsRepository, ({ isSupported }) => isSupported?.() !== false);
};

interface AdMobItemProps {
    nativeAd: NativeAd;
    height?: number;
}

const AdMobItem: React.FC<AdMobItemProps> = ({
    nativeAd,
    height
}) => {
    const theme = useAppTheme();
    const primaryColor = theme.primary;
    const onPrimaryColor = theme.background;
    const textColor = theme.text;
    const placeholderColor = theme.text;

    useEffect(() => {
        getEvents()?.adMobItemRendered?.();
    }, []);

    const hasMedia = Boolean(
        nativeAd.mediaContent &&
        (nativeAd.mediaContent.aspectRatio > 0 || nativeAd.mediaContent.hasVideoContent)
    );

    return (
        <Content height={height}>
            <Badge>
                Sponsored
            </Badge>
            <VerticalSpacer size={TOP_PADDING} />
            <ContentRow>
                {Boolean(nativeAd.icon && (nativeAd.icon as object | string) !== 'noicon') && (
                    <>
                        <NativeAsset assetType={NativeAssetType.ICON}>
                            <Image
                                source={{ uri: nativeAd.icon?.url }}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        </NativeAsset>
                        <HorizontalSpacer />
                    </>
                )}
                <ContentColumn>
                    <NativeAsset assetType={NativeAssetType.HEADLINE}>
                        <Text style={[styles.title, { color: textColor }]}>
                            {nativeAd.headline}
                        </Text>
                    </NativeAsset>
                    {Boolean(nativeAd.body) && (
                        <>
                            <VerticalSpacer size={5} />
                            <NativeAsset assetType={NativeAssetType.BODY}>
                                <Text style={[styles.label, { color: placeholderColor }]}>
                                    {nativeAd.body}
                                </Text>
                            </NativeAsset>
                        </>
                    )}
                    {Boolean(nativeAd.advertiser) && (
                        <>
                            <VerticalSpacer size={5} />
                            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                                <Text style={[styles.advertiser, { color: textColor }]}>
                                    {nativeAd.advertiser}
                                </Text>
                            </NativeAsset>
                        </>
                    )}
                </ContentColumn>
            </ContentRow>
            {hasMedia ? (
                <View style={styles.adMobMediaWrapper}>
                    <NativeMediaView
                        style={[
                            styles.media,
                            { aspectRatio: nativeAd.mediaContent?.aspectRatio || 16 / 9 }
                        ]}
                        resizeMode="contain"
                    />
                </View>
            ) : (
                <View style={styles.flexSpacer} />
            )}
            {Boolean(nativeAd.callToAction) && (
                <ActionRow>
                    <VerticalSpacer size={10} />
                    <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                        <Text
                            style={[
                                styles.actionText,
                                { backgroundColor: primaryColor, color: onPrimaryColor }
                            ]}
                        >
                            {nativeAd.callToAction}
                        </Text>
                    </NativeAsset>
                </ActionRow>
            )}
        </Content>
    );
};

interface LocalAdItemProps {
    height?: number;
}

const LocalAdItem: React.FC<LocalAdItemProps> = ({ height }) => {
    const { width } = useDimensions('window');
    const {
        currentLayout: itemLayout,
        setCurrentLayout: setItemLayout
    } = useLayout({ width, height: height ?? 0 });
    const {
        currentLayout: contentLayout,
        setCurrentLayout: setContentLayout
    } = useLayout({ height: 0 });
    const {
        currentLayout: actionLayout,
        setCurrentLayout: setActionLayout
    } = useLayout({ height: 0 });
    const localAd = useMemo(() => sample(listItemAdsRepository), []);

    useEffect(() => {
        getEvents()?.localAdItemRendered?.(localAd);
    }, [localAd]);

    if (!localAd) {
        return null;
    }

    const mediaHeight = (
        itemLayout.height -
        TOP_PADDING -
        contentLayout.height -
        MEDIA_TOP_MARGIN -
        actionLayout.height
    );

    const onPress = (): void => {
        localAd.action?.execute();
        getEvents()?.localAdItemActionExecuted?.(localAd);
    };

    return (
        <Content
            onLayout={(event: LayoutChangeEvent) => setItemLayout(event.nativeEvent.layout)}
            height={height}
        >
            <Badge>
                Sponsored
            </Badge>
            <VerticalSpacer size={TOP_PADDING} />
            <ContentRow
                onLayout={(event: LayoutChangeEvent) => setContentLayout(event.nativeEvent.layout)}
            >
                {Boolean(localAd.iconUrl) && (
                    <>
                        <LocalAdIcon
                            source={{ uri: localAd.iconUrl }}
                            resizeMode="contain"
                        />
                        <HorizontalSpacer />
                    </>
                )}
                <ContentColumn>
                    <LocalAdTitle>
                        {localAd.title}
                    </LocalAdTitle>
                    {Boolean(localAd.description) && (
                        <>
                            <VerticalSpacer size={5} />
                            <LocalAdLabel>
                                {localAd.description}
                            </LocalAdLabel>
                        </>
                    )}
                    {Boolean(localAd.advertiser) && (
                        <>
                            <VerticalSpacer size={5} />
                            <LocalAdAdvertiser>
                                {localAd.advertiser}
                            </LocalAdAdvertiser>
                        </>
                    )}
                </ContentColumn>
            </ContentRow>
            <MediaWrapper height={mediaHeight}>
                <LocalAdImage
                    source={{ uri: localAd.imageUrl }}
                    resizeMode="contain"
                />
            </MediaWrapper>
            {Boolean(localAd.action) && (
                <ActionRow
                    onLayout={(event: LayoutChangeEvent) => setActionLayout(event.nativeEvent.layout)}
                >
                    <VerticalSpacer size={10} />
                    <LocalAdActionButton
                        onPress={onPress}
                    >
                        {localAd.action?.title}
                    </LocalAdActionButton>
                </ActionRow>
            )}
        </Content>
    );
};

interface ListItemRootViewProps {
    children?: React.ReactNode;
}

interface ListItemAdProps {
    RootView: React.ComponentType<ListItemRootViewProps>;
    adUnitId: string;
    height?: number;
}

export const ListItemAd: React.FC<ListItemAdProps> = React.memo(({
    RootView,
    adUnitId,
    height = 400
}) => {
    const [nativeAd, setNativeAd] = useState<NativeAd | undefined>();

    useEffect(() => {
        let currentAd: NativeAd | undefined;
        void NativeAd.createForAdRequest(adUnitId, {
            aspectRatio: NativeMediaAspectRatio.LANDSCAPE,
        }).then((ad) => {
            currentAd = ad;
            setNativeAd(ad);
        });

        return () => {
            currentAd?.destroy();
        };
    }, [adUnitId]);

    return (
        <RootView>
            {nativeAd ? (
                <NativeAdView nativeAd={nativeAd} style={styles.fullWidth}>
                    <AdMobItem
                        nativeAd={nativeAd}
                        height={height}
                    />
                </NativeAdView>
            ) : (
                <LocalAdItem height={height} />
            )}
        </RootView>
    );
});

const styles = StyleSheet.create({
    fullWidth: {
        width: '100%',
    },
    content: {
        width: '100%',
        flexDirection: 'column',
    },
    contentRow: {
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',
    },
    contentColumn: {
        flex: 1,
        flexDirection: 'column',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        padding: 4,
        borderWidth: 1,
        borderRadius: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 20,
    },
    label: {
        fontSize: 14,
        lineHeight: 16,
    },
    advertiser: {
        fontWeight: '600',
        fontSize: 10,
    },
    mediaWrapper: {
        width: '100%',
        position: 'relative',
        marginTop: MEDIA_TOP_MARGIN,
        overflow: 'hidden',
    },
    adMobMediaWrapper: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: MEDIA_TOP_MARGIN,
        overflow: 'hidden',
    },
    flexSpacer: {
        flex: 1,
    },
    media: {
        width: '100%',
        maxHeight: '100%',
    },
    absoluteFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    icon: {
        width: 60,
        height: 60,
    },
    actionRow: {
        flexDirection: 'column',
    },
    relative: {
        position: 'relative',
    },
    actionButton: {
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: {
        borderRadius: 4,
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 38,
        textAlign: 'center',
        overflow: 'hidden',
    },
});
