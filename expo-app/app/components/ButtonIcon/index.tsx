import styled from '@emotion/native';
import { ReactNode, useState, useEffect } from 'react';
import { TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../../values/colors';

export type ButtonIconColor = 'white' | 'dark' | 'blue';

export const getBgColor = (color: ButtonIconColor) => {
  switch (color) {
    case 'white':
      return Colors.White;
    case 'blue':
      return Colors.Blue;
    case 'dark':
      return Colors.Black + '20';
    default:
      return 'transparent';
  }
};

const Wrap = styled.TouchableOpacity<{
  color?: ButtonIconColor;
  circle?: boolean;
  size: number;
}>`
  justify-content: center;
  align-items: center;
  background-color: ${(props) => getBgColor(props.color)};
  border-radius: ${(props) => (props.circle ? '32px' : '0')};
  padding: 15px;
  width: ${(props) => String(props.size)}px;
  height: ${(props) => String(props.size)}px;
`;

export type ButtonIconProps = {
  icon: ReactNode;
  touchableProps?: TouchableOpacityProps;
  color?: ButtonIconColor;
  circle?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export const ButtonIcon = ({
  size = 32,
  icon,
  touchableProps,
  color,
  circle = false,
  style,
}: ButtonIconProps) => {
  const [iconEl, setIconEl] = useState(icon);

  useEffect(() => setIconEl(icon), [icon]);

  return (
    <Wrap
      color={color}
      circle={circle}
      size={size}
      {...touchableProps}
      style={style}
    >
      {iconEl}
    </Wrap>
  );
};
