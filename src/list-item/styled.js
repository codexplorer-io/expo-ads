import styled from 'styled-components/native';
import { Button, Text } from 'react-native-paper';
import { OS } from '@codexporer.io/expo-device';
import { NativeMediaView } from 'react-native-google-mobile-ads';

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

export const LocalAdTitle = styled.Text`
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
    color: ${({ theme }) => theme.colors.foreground};
`;

export const AdMobTitle = LocalAdTitle;

export const LocalAdLabel = styled.Text`
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.placeholder};
`;

export const AdMobLabel = LocalAdLabel;

export const LocalAdAdvertiser = styled.Text`
    font-weight: 600;
    font-size: 10px;
    color: ${({ theme }) => theme.colors.foreground};
`;

export const AdMobAdvertiser = LocalAdAdvertiser;

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

export const LocalAdImage = styled.Image`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

export const LocalAdIcon = styled.Image`
    width: 60px;
    height: 60px;
`;

export const AdMobIcon = LocalAdIcon;

export const ActionRow = styled.View`
    display: flex;
    flex-direction: column;
`;

export const AdMobActionWrapper = OS.isIOS() ? styled.View`
    position: relative;
` : ({ children }) => children;

export const LocalAdAction = styled(Button)``;

export const AdMobAction = styled.Text`
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
    font-size: 15px;
    font-weight: 600;
    line-height: 38px;
    text-align: center;
    color: ${({ theme }) => theme.colors.onPrimary};
`;
