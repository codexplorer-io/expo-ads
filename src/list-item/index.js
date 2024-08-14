import React, {
    useEffect,
    useState,
    useRef,
    useContext,
    useCallback,
    useMemo
} from 'react';
import { useTheme } from 'react-native-paper';
import toUpper from 'lodash/toUpper';
import { findNodeHandle } from 'react-native';
import NativeAdView, { NativeAdContext } from 'react-native-admob-native-ads';
import { useDimensions } from '@codexporer.io/react-hooks';
import { useLayout } from '@codexporer.io/expo-layout-state';
import sample from 'lodash/sample';
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
    AdMobImage,
    LocalAdImage,
    AdMobIcon,
    LocalAdIcon,
    AdMobAdvertiser,
    ActionRow,
    AdMobActionWrapper,
    AdMobAction,
    LocalAdAction,
    AdMobActionTrigger,
    LocalAdAdvertiser
} from './styled';
import { getEvents } from '../events';

const TOP_PADDING = 40;

let listItemAdsRepository = [];
export const initializeListItemAdsRepository = adsRepository => {
    listItemAdsRepository = adsRepository;
};

const AdMobItem = ({ height, isAdMobLoaded }) => {
    const theme = useTheme();
    const { nativeAd, nativeAdView } = useContext(NativeAdContext);
    const actionRef = useRef();
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

    const onActionLayout = useCallback(() => {
        if (!nativeAdView) return;

        nativeAdView.setNativeProps({
            callToAction: findNodeHandle(actionRef.current)
        });
    }, [nativeAdView, actionRef]);

    useEffect(() => {
        isAdMobLoaded && getEvents()?.adMobItemRendered?.();
    }, [isAdMobLoaded]);

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
                        <AdMobIcon />
                        <HorizontalSpacer />
                    </>
                )}
                <ContentColumn>
                    <AdMobTitle />
                    {!!nativeAd.tagline && (
                        <>
                            <VerticalSpacer size={5} />
                            <AdMobLabel />
                        </>
                    )}
                    {!!nativeAd.advertiser && (
                        <>
                            <VerticalSpacer size={5} />
                            <AdMobAdvertiser />
                        </>
                    )}
                </ContentColumn>
            </ContentRow>
            <MediaWrapper height={mediaHeight}>
                <AdMobImage resizeMode='contain' />
                <AdMobMedia />
            </MediaWrapper>
            {!!nativeAd.callToAction && (
                <ActionRow
                    onLayout={event => setActionLayout(event.nativeEvent.layout)}
                >
                    <VerticalSpacer size={10} />
                    <AdMobActionWrapper>
                        <AdMobAction mode='contained'>
                            {nativeAd.callToAction}
                        </AdMobAction>
                        <AdMobActionTrigger
                            ref={actionRef}
                            onLayout={onActionLayout}
                            title={toUpper(nativeAd.callToAction)}
                            buttonAndroidStyle={{
                                color: theme.colors.background,
                                backgroundColor: theme.colors.primary,
                                borderColor: theme.colors.primary,
                                fontSize: 14,
                                borderRadius: 4
                            }}
                        />
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
    const nativeAdViewRef = useRef();
    const [
        isAdMobLoaded,
        setIsAdMobLoaded
    ] = useState(false);

    useEffect(() => {
        nativeAdViewRef.current?.loadAd();
    }, []);

    const onAdLoaded = () => {
        setIsAdMobLoaded(true);
    };

    return (
        <RootView>
            <ShowView isVisible={!isAdMobLoaded}>
                <LocalAdItem height={height} />
            </ShowView>
            <ShowView isVisible={isAdMobLoaded}>
                <NativeAdView
                    ref={nativeAdViewRef}
                    adUnitID={adUnitId}
                    onAdLoaded={onAdLoaded}
                    adChoicesPlacement='topRight'
                    videoOptions={{
                        muted: true,
                        clickToExpand: false,
                        customControlsRequested: false
                    }}
                >
                    <AdMobItem
                        height={height}
                        isAdMobLoaded={isAdMobLoaded}
                    />
                </NativeAdView>
            </ShowView>
        </RootView>
    );
});
