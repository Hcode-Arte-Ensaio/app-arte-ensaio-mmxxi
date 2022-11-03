import { ReactNode, useState, useEffect } from 'react';
import styled from '@emotion/native';
import {
  TouchableOpacityProps,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../values/colors';

export type ButtonColorType = 'outlined' | 'blue' | 'dark' | 'text';
export type ButtonSizeType = 'small' | 'medium';

const getColor = (color: ButtonColorType) => {
  switch (color) {
    case 'blue':
    case 'outlined':
    case 'dark':
      return Colors.White;
    case 'text':
      return Colors.Gray;
  }
};

const getBorder = (color: ButtonColorType) => {
  switch (color) {
    case 'dark':
    case 'blue':
    case 'text':
      return `none`;
    case 'outlined':
      return `#fff 1px solid`;
  }
};

const getBackground = (color: ButtonColorType) => {
  switch (color) {
    case 'blue':
      return Colors.Blue;
    case 'outlined':
    case 'text':
      return `transparent`;
    case 'dark':
      return Colors.Black + '20';
  }
};

const getPadding = (size: ButtonSizeType) => {
  switch (size) {
    case 'medium':
      return '10px';
    case 'small':
      return `6px 10px`;
  }
};

const getMinHeight = (size: ButtonSizeType) => {
  switch (size) {
    case 'medium':
      return '50px';
    case 'small':
      return `35px`;
  }
};

const getFontSize = (size: ButtonSizeType) => {
  switch (size) {
    case 'medium':
      return 16;
    case 'small':
      return 12;
  }
};

const getLoadingSize = (size: ButtonSizeType) => {
  switch (size) {
    case 'medium':
      return 24;
    case 'small':
      return 16;
  }
};

const ButtonSplitsWrap = styled.View<{
  color: ButtonColorType;
  radius: number;
  size: ButtonSizeType;
}>`
  border-radius: ${(props) => String(props.radius)}px;
  border: ${(props) => getBorder(props.color)};
  background-color: ${(props) => getBackground(props.color)};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  min-height: ${(props) => getMinHeight(props.size)};
`;

const ButtonWrap = styled.TouchableOpacity<{
  color: ButtonColorType;
  radius: number;
  size: ButtonSizeType;
}>`
  border-radius: ${(props) => String(props.radius)}px;
  border: ${(props) => getBorder(props.color)};
  background-color: ${(props) => getBackground(props.color)};
  padding: ${(props) => getPadding(props.size)};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  min-height: ${(props) => getMinHeight(props.size)};
`;

const ButtonText = styled.Text<{
  size: ButtonSizeType;
  color: ButtonColorType;
}>`
  color: #fff;
  font-size: ${(props) => String(getFontSize(props.size))}px;
  color: ${(props) => getColor(props.color)};
  font-weight: bold;
  margin: 0 5px;
  text-transform: uppercase;
`;

const View = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const IconWrap = styled.View`
  padding: 2px;
  align-items: center;
  justify-content: center;
`;

const ButtonSplitWrap = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ButtonSplit = styled.TouchableOpacity<{ size: ButtonSizeType }>`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${(props) => getPadding(props.size)};
`;

const ButtonSplitDivider = styled.View`
  background-color: ${Colors.White};
  width: 1px;
  height: 32px;
`;

export type ButtonSplitType = {
  text: string;
  icon?: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
};

export type ButtonProps = {
  children?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  propsTouchable?: TouchableOpacityProps;
  color?: ButtonColorType;
  radius?: number;
  size?: ButtonSizeType;
  split?: ButtonSplitType[];
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
};

export const Button = ({
  children,
  propsTouchable,
  color = 'blue',
  startIcon,
  endIcon,
  radius = 15,
  size = 'medium',
  split,
  style,
  loading = false,
}: ButtonProps) => {
  const [isLoading, setisLoading] = useState(loading);

  useEffect(() => setisLoading(loading), [loading]);

  if (split && split instanceof Array && split.length > 0) {
    return (
      <View>
        {isLoading && (
          <ActivityIndicator
            size={getLoadingSize(size)}
            color={getColor(color)}
          />
        )}
        {!isLoading && (
          <ButtonSplitsWrap
            color={color}
            radius={radius}
            size={size}
            style={[{ justifyContent: 'space-between' }, style]}
          >
            {split.map(({ icon, text, onPress }, index) => {
              return (
                <ButtonSplitWrap key={index}>
                  <ButtonSplit
                    onPress={onPress}
                    size={size}
                    disabled={isLoading}
                  >
                    {icon && (
                      <IconWrap style={{ marginRight: 5 }}>{icon}</IconWrap>
                    )}
                    <ButtonText size={size} color={color}>
                      {text}
                    </ButtonText>
                  </ButtonSplit>
                  {index + 1 < split.length && <ButtonSplitDivider />}
                </ButtonSplitWrap>
              );
            })}
          </ButtonSplitsWrap>
        )}
      </View>
    );
  } else {
    return (
      <ButtonWrap
        {...propsTouchable}
        color={color}
        radius={radius}
        size={size}
        style={style}
        disabled={isLoading}
      >
        {isLoading && (
          <ActivityIndicator
            size={getLoadingSize(size)}
            color={getColor(color)}
          />
        )}
        {!isLoading && (
          <View>
            {startIcon && (
              <IconWrap style={{ marginLeft: 5 }}>{startIcon}</IconWrap>
            )}
            <ButtonText size={size} color={color}>
              {children}
            </ButtonText>
            {endIcon && (
              <IconWrap style={{ marginRight: 5 }}>{endIcon}</IconWrap>
            )}
          </View>
        )}
      </ButtonWrap>
    );
  }
};
