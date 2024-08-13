import styled from 'styled-components/native';
import {
    Button,
    Text
} from 'react-native-paper';
import { OS } from '@codexporer.io/expo-device';
import {
    HeadlineView,
    TaglineView,
    AdvertiserView,
    NativeMediaView,
    ImageView,
    IconView,
    RnAdMobButton
} from 'react-native-admob-native-ads';

export const MEDIA_TOP_MARGIN = 10;

export const VerticalSpacer = styled.View`
    height: ${({ size = 10 }) => size}px;
`;

export const HorizontalSpacer = styled.View`
    width: ${({ size = 10 }) => size}px;
`;

export const Content = styled.View`
    display: flex;
    flex-direction: column;
    height: ${({ height }) => height}px;
`;

export const ShowView = styled.View`
    display: ${({ isVisible }) => isVisible ? 'block' : 'none'};
`;

export const ContentRow = styled.View`
    display: flex;
    flex-direction: row;
    position: relative;
    align-items: center;
`;

export const ContentColumn = styled.View`
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
`;

export const Badge = styled(Text)`
    position: absolute;
    padding: 4px;
    border-width: 1px;
    border-radius: 4px;
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
`;

export const AdMobTitle = styled(HeadlineView)`
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
`;

export const LocalAdTitle = styled(Text)`
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
`;

export const AdMobLabel = styled(TaglineView)`
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.placeholder};
`;

export const LocalAdLabel = styled(Text)`
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.placeholder};
`;

export const AdMobAdvertiser = styled(AdvertiserView)`
    font-weight: 600;
    font-size: 10px;
`;

export const LocalAdAdvertiser = styled(Text)`
    font-weight: 600;
    font-size: 10px;
`;

export const MediaWrapper = styled.View`
    height: ${({ height }) => height}px;
    position: relative;
    margin-top: ${MEDIA_TOP_MARGIN}px;
    overflow: hidden;
`;

export const AdMobMedia = styled(NativeMediaView)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

export const AdMobImage = styled(ImageView)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

export const LocalAdImage = styled.Image`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

export const AdMobIcon = styled(IconView)`
    width: 60px;
    height: 60px;
`;

export const LocalAdIcon = styled.Image`
    width: 60px;
    height: 60px;
`;

export const ActionRow = styled.View`
    display: flex;
    flex-direction: column;
`;

export const AdMobActionWrapper = OS.isIOS() ? styled.View`
    position: relative;
` : ({ children }) => children;

export const AdMobAction = OS.isIOS() ? styled(Button)`` : () => null;

export const AdMobActionTrigger = OS.isIOS() ? styled.View`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
` : styled(RnAdMobButton)`
    border-color: ${({ buttonAndroidStyle }) => buttonAndroidStyle.borderColor};
    background-color: ${({ buttonAndroidStyle }) => buttonAndroidStyle.backgroundColor};
    color: ${({ buttonAndroidStyle }) => buttonAndroidStyle.color};
    font-size: ${({ buttonAndroidStyle }) => buttonAndroidStyle.fontSize}px;
    font-weight: 600;
    border-radius: ${({ buttonAndroidStyle }) => buttonAndroidStyle.borderRadius}px;
    min-height: 40px;
`;

export const LocalAdAction = styled(Button)``;
