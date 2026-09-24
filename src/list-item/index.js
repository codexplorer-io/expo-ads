import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import filter from 'lodash/filter';
import sample from 'lodash/sample';
import { useDimensions } from '@codexporer.io/react-hooks';
import { useLayout } from '@codexporer.io/expo-layout-state';
import { OS } from '@codexporer.io/expo-device';
import { useAppTheme } from '@codexporer.io/expo-app-theme';
import {
    NativeAd,
    NativeAdView,
    NativeAsset,
    NativeAssetType,
    NativeMediaView
} from 'react-native-google-mobile-ads';
import { getEvents } from '../events';

const MEDIA_TOP_MARGIN = 10;
const TOP_PADDING = 40;

const VerticalSpacer = ({ size = 10 }) => <View style={{ height: size }} />;
const HorizontalSpacer = ({ size = 10 }) => <View style={{ width: size }} />;

const Content = ({ children, onLayout, height }) => (
    <View style={[styles.content, { height }]} onLayout={onLayout}>
        {children}
    </View>
);

const ShowView = ({ children, isVisible }) => (
    <View style={{ display: isVisible ? 'flex' : 'none' }}>
        {children}
    </View>
);

const ContentRow = ({ children, onLayout }) => (
    <View style={styles.contentRow} onLayout={onLayout}>
        {children}
    </View>
);

const ContentColumn = ({ children }) => (
    <View style={styles.contentColumn}>
        {children}
    </View>
);

const Badge = ({ children }) => {
    const theme = useAppTheme();
    const primaryColor = theme.primary;
    return (
        <Text style={[styles.badge, { borderColor: primaryColor, color: primaryColor }]}>
            {children}
        </Text>
    );
};

const LocalAdTitle = ({ children }) => {
    const theme = useAppTheme();
    const textColor = theme.text;
    return (
        <Text style={[styles.title, { color: textColor }]}>
            {children}
        </Text>
    );
};
const AdMobTitle = LocalAdTitle;

const LocalAdLabel = ({ children }) => {
    const theme = useAppTheme();
    const placeholderColor = theme.text;
    return (
        <Text style={[styles.label, { color: placeholderColor }]}>
            {children}
        </Text>
    );
};
const AdMobLabel = LocalAdLabel;

const LocalAdAdvertiser = ({ children }) => {
    const theme = useAppTheme();
    const textColor = theme.text;
    return (
        <Text style={[styles.advertiser, { color: textColor }]}>
            {children}
        </Text>
    );
};
const AdMobAdvertiser = LocalAdAdvertiser;

const MediaWrapper = ({ children, height }) => (
    <View style={[styles.mediaWrapper, { height }]}>
        {children}
    </View>
);

const AdMobMedia = (props) => <NativeMediaView style={styles.absoluteFill} {...props} />;
const LocalAdImage = (props) => <Image style={styles.absoluteFill} {...props} />;
const LocalAdIcon = (props) => <Image style={styles.icon} {...props} />;
const AdMobIcon = LocalAdIcon;

const ActionRow = ({ children, onLayout }) => (
    <View style={styles.actionRow} onLayout={onLayout}>
        {children}
    </View>
);

const AdMobActionWrapper = ({ children }) => OS.isIOS() ? (
    <View style={styles.relative}>{children}</View>
) : children;

const AdMobAction = ({ children }) => {
    const theme = useAppTheme();
    const primaryColor = theme.primary;
    const onPrimaryColor = theme.background;
    return (
        <Text style={[styles.actionText, { backgroundColor: primaryColor, color: onPrimaryColor }]}>
            {children}
        </Text>
    );
};

const LocalAdAction = ({ children, onPress }) => {
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

let listItemAdsRepository = [];
export const initializeListItemAdsRepository = adsRepository => {
    listItemAdsRepository = filter(adsRepository, ({ isSupported }) => isSupported?.() !== false);
};

const AdMobItem = ({
    nativeAd,
    height
}) => {
    const { width } = useDimensions('window');
    const {
        currentLayout: itemLayout,
        setCurrentLayout: setItemLayout
    } = useLayout({ width, height });
    const {
        currentLayout: contentLayout,
        setCurrentLayout: setContentLayout
    } = useLayout({ height: 0 });
    const {
        currentLayout: actionLayout,
        setCurrentLayout: setActionLayout
    } = useLayout({ height: 0 });

    useEffect(() => {
        getEvents()?.adMobItemRendered?.();
    }, []);

    const mediaHeight = (
        itemLayout.height -
        TOP_PADDING -
        contentLayout.height -
        MEDIA_TOP_MARGIN -
        actionLayout.height
    );

    return (
        <Content
            onLayout={event => setItemLayout(event.nativeEvent.layout)}
            height={height}
        >
            <Badge>
                Sponsored
            </Badge>
            <VerticalSpacer size={TOP_PADDING} />
            <ContentRow
                onLayout={event => setContentLayout(event.nativeEvent.layout)}
            >
                {!!nativeAd.icon && nativeAd.icon !== 'noicon' && (
                    <>
                        <NativeAsset assetType={NativeAssetType.ICON}>
                            <AdMobIcon
                                source={{ uri: nativeAd.icon.url }}
                                resizeMode='contain'
                            />
                        </NativeAsset>
                        <HorizontalSpacer />
                    </>
                )}
                <ContentColumn>
                    <NativeAsset assetType={NativeAssetType.HEADLINE}>
                        <AdMobTitle>{nativeAd.headline}</AdMobTitle>
                    </NativeAsset>
                    {!!nativeAd.body && (
                        <>
                            <VerticalSpacer size={5} />
                            <NativeAsset assetType={NativeAssetType.BODY}>
                                <AdMobLabel>{nativeAd.body}</AdMobLabel>
                            </NativeAsset>
                        </>
                    )}
                    {!!nativeAd.advertiser && (
                        <>
                            <VerticalSpacer size={5} />
                            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                                <AdMobAdvertiser>{nativeAd.advertiser}</AdMobAdvertiser>
                            </NativeAsset>
                        </>
                    )}
                </ContentColumn>
            </ContentRow>
            <MediaWrapper height={mediaHeight}>
                <AdMobMedia />
            </MediaWrapper>
            {!!nativeAd.callToAction && (
                <ActionRow
                    onLayout={event => setActionLayout(event.nativeEvent.layout)}
                >
                    <VerticalSpacer size={10} />
                    <AdMobActionWrapper>
                        <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                            <AdMobAction>
                                {nativeAd.callToAction}
                            </AdMobAction>
                        </NativeAsset>
                    </AdMobActionWrapper>
                </ActionRow>
            )}
        </Content>
    );
};

const LocalAdItem = ({ height }) => {
    const { width } = useDimensions('window');
    const {
        currentLayout: itemLayout,
        setCurrentLayout: setItemLayout
    } = useLayout({ width, height });
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

    const mediaHeight = (
        itemLayout.height -
        TOP_PADDING -
        contentLayout.height -
        MEDIA_TOP_MARGIN -
        actionLayout.height
    );

    const onPress = () => {
        localAd.action.execute();
        getEvents()?.localAdItemActionExecuted?.(localAd);
    };

    return !!localAd && (
        <Content
            onLayout={event => setItemLayout(event.nativeEvent.layout)}
            height={height}
        >
            <Badge>
                Sponsored
            </Badge>
            <VerticalSpacer size={TOP_PADDING} />
            <ContentRow
                onLayout={event => setContentLayout(event.nativeEvent.layout)}
            >
                {!!localAd.iconUrl && (
                    <>
                        <LocalAdIcon
                            source={{ uri: localAd.iconUrl }}
                            resizeMode='contain'
                        />
                        <HorizontalSpacer />
                    </>
                )}
                <ContentColumn>
                    <LocalAdTitle>
                        {localAd.title}
                    </LocalAdTitle>
                    {!!localAd.description && (
                        <>
                            <VerticalSpacer size={5} />
                            <LocalAdLabel>
                                {localAd.description}
                            </LocalAdLabel>
                        </>
                    )}
                    {!!localAd.advertiser && (
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
                    resizeMode='contain'
                />
            </MediaWrapper>
            {!!localAd.action && (
                <ActionRow
                    onLayout={event => setActionLayout(event.nativeEvent.layout)}
                >
                    <VerticalSpacer size={10} />
                    <AdMobActionWrapper>
                        <LocalAdAction
                            onPress={onPress}
                        >
                            {localAd.action.title}
                        </LocalAdAction>
                    </AdMobActionWrapper>
                </ActionRow>
            )}
        </Content>
    );
};

export const ListItemAd = React.memo(({
    RootView,
    adUnitId,
    height = 400
}) => {
    const [nativeAd, setNativeAd] = useState();

    useEffect(() => {
        NativeAd.createForAdRequest(adUnitId).then(setNativeAd);
    }, [adUnitId]);

    return (
        <RootView>
            <ShowView isVisible={!nativeAd}>
                <LocalAdItem height={height} />
            </ShowView>
            <ShowView isVisible>
                {!!nativeAd && (
                    <NativeAdView nativeAd={nativeAd}>
                        <AdMobItem
                            nativeAd={nativeAd}
                            height={height}
                        />
                    </NativeAdView>
                )}
            </ShowView>
        </RootView>
    );
});

const styles = StyleSheet.create({
    content: {
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
        position: 'relative',
        marginTop: MEDIA_TOP_MARGIN,
        overflow: 'hidden',
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
    },
});
