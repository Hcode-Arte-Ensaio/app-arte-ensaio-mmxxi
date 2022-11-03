import styled from '@emotion/native';
import { useEffect, useState, useCallback } from 'react';
import { TouchableOpacityProps, GestureResponderEvent } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Colors } from '../../values/colors';

const Wrap = styled.TouchableOpacity`
  padding-right: 25px;
  padding-left: 25px;
  position: relative;
  align-self: flex-start;
  margin-bottom: 15px;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text<{ actived?: boolean }>`
  font-size: 15px;
  font-weight: bold;
  color: ${(props) => (props.actived ? Colors.Blue : Colors.Black)};
`;

const Bullet = styled.View`
  background-color: ${Colors.Blue};
  width: 6px;
  height: 6px;
  border-radius: 3px;
  position: absolute;
  bottom: -15px;
`;

export type CategoryItemLayoutType = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type CategoryItemProps = {
  title: string;
  active?: boolean;
  touchableOpacityProps?: TouchableOpacityProps;
  onPress?: (
    event: GestureResponderEvent,
    layout: CategoryItemLayoutType
  ) => void;
};

export const CategoryItem = ({
  title,
  active,
  touchableOpacityProps,
  onPress,
}: CategoryItemProps) => {
  const [layout, setLayout] = useState<CategoryItemLayoutType>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [actived, setActived] = useState(active);

  const onLayout = useCallback((e) => {
    setLayout(e.nativeEvent.layout);
  }, []);

  const onPressHandler = useCallback(
    (e) => {
      if (typeof onPress === 'function') {
        onPress(e, layout);
      }
    },
    [layout, onPress]
  );

  useEffect(() => setActived(active), [active]);

  return (
    <Wrap
      {...touchableOpacityProps}
      onLayout={onLayout}
      onPress={onPressHandler}
    >
      <Title
        actived={actived}
        style={{
          textShadowColor: 'rgba(0, 0, 0, 0.15)',
          textShadowOffset: { width: 0, height: 4 },
          textShadowRadius: actived ? 8 : 0,
        }}
      >
        {title}
      </Title>
      {active && (
        <Shadow
          offset={[3, 10]}
          distance={8}
          style={{ borderRadius: 3 }}
          startColor={'#00000005'}
        >
          <Bullet />
        </Shadow>
      )}
    </Wrap>
  );
};
