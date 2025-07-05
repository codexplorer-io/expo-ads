import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import filter from 'lodash/filter';
import { useDimensions } from '@codexporer.io/react-hooks';
import { useLayout } from '@codexporer.io/expo-layout-state';
import sample from 'lodash/sample';
import {
    NativeAd,
    NativeAdView,
    NativeAsset,
    NativeAssetType
} from 'react-native-google-mobile-ads';
import {
    MEDIA_TOP_MARGIN,
    ShowView,
    VerticalSpacer,
    HorizontalSpacer,
    Content,
    ContentRow,
    ContentColumn,
    Badge,
    AdMobTitle,
    LocalAdTitle,
    AdMobLabel,
    LocalAdLabel,
    MediaWrapper,
    AdMobMedia,
    LocalAdImage,
    AdMobIcon,
    LocalAdIcon,
    AdMobAdvertiser,
    ActionRow,
    AdMobActionWrapper,
    AdMobAction,
    LocalAdAction,
    LocalAdAdvertiser
} from './styled';
import { getEvents } from '../events';

const TOP_PADDING = 40;

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
                            <AdMobAction
                                mode='contained'
                            >
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
                            mode='contained'
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
