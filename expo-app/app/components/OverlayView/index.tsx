import styled from '@emotion/native';
import { BlurTint, BlurView } from 'expo-blur';
import { GestureResponderEvent } from 'react-native';

const Overlay = styled.TouchableOpacity``;

export type OverlayViewProps = {
  onPress?: (event: GestureResponderEvent) => void;
  activeOpacity?: number;
  intensity?: number;
  tint?: BlurTint;
};

export const OverlayView = ({
  onPress,
  activeOpacity = 0.9,
  intensity = 100,
  tint = 'dark',
}: OverlayViewProps) => {
  return (
    <Overlay
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 99,
      }}
      onPress={onPress}
      activeOpacity={activeOpacity}
    >
      <BlurView
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 99,
        }}
        intensity={intensity}
        tint={tint}
      />
    </Overlay>
  );
};
