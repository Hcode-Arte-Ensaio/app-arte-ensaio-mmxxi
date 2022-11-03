import styled from '@emotion/native';
import { Shadow } from 'react-native-shadow-2';
import { ImageProps, GestureResponderEvent } from 'react-native';

const Wrap = styled.TouchableOpacity``;

const AvatarImage = styled.Image<{ size: number }>`
  width: ${(props) => String(props.size)}px;
  height: ${(props) => String(props.size)}px;
  border-radius: ${(props) => String(props.size / 2)}px;
`;

export type AvatarProps = {
  size?: number;
  imageProps: ImageProps;
  onPress?: (event: GestureResponderEvent) => void;
};

export const Avatar = ({ imageProps, onPress, size = 48 }: AvatarProps) => {
  return (
    <Wrap onPress={onPress}>
      <Shadow
        offset={[0, 4]}
        distance={4}
        style={{ borderRadius: size / 2 }}
        startColor={'#00000015'}
      >
        <AvatarImage {...imageProps} size={size} />
      </Shadow>
    </Wrap>
  );
};
