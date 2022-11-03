import styled from '@emotion/native';
import { ReactNode, useCallback, useState, useEffect } from 'react';
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputProps,
  GestureResponderEvent,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { IconProps } from '../../icons/Icon';
import { Colors } from '../../values/colors';

const Wrap = styled.View``;

const InputWrap = styled.View<{ height: number }>`
  background-color: #fff;
  min-height: ${(props) => String(props.height)}px;
  min-width: 300px;
  width: auto;
  align-self: stretch;
  border-radius: 15px;
  position: relative;
`;

const Label = styled.Text`
  font-size: 15px;
  font-weight: bold;
  padding: 10px 0;
`;

const InputField = styled.TextInput`
  padding: 10px 15px;
  padding-right: 40px;
  border-radius: 15px;
  color: ${Colors.Black};
`;

const EndIconWrap = styled.TouchableOpacity`
  position: absolute;
  right: 5px;
  top: 4px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;

const EndIcon = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${Colors.White};
  justify-content: center;
  align-items: center;
`;

export type InputProps = {
  label?: string;
  textInputProps?: TextInputProps;
  endIcon?: ReactNode;
  onPressAction?: (event: GestureResponderEvent) => void;
  endIconDisabled?: boolean;
  height?: number;
};

export const Input = ({
  textInputProps = {},
  label,
  endIcon,
  onPressAction,
  endIconDisabled = false,
  height = 40,
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [isEndIconDisabled, setIsEndIconDisabled] = useState(endIconDisabled);

  if (!textInputProps.placeholderTextColor) {
    textInputProps.placeholderTextColor = Colors.Gray;
  }

  if (endIcon) {
    (endIcon as IconProps).svgProps = {
      width: 20,
      height: 20,
    };
  }

  const onBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (typeof textInputProps.onBlur === 'function') {
        textInputProps.onBlur(e);
      }

      setFocused(false);
    },
    [textInputProps]
  );

  const onFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (typeof textInputProps.onFocus === 'function') {
        textInputProps.onFocus(e);
      }

      setFocused(true);
    },
    [textInputProps]
  );

  useEffect(() => setIsEndIconDisabled(endIconDisabled), [endIconDisabled]);

  return (
    <Wrap>
      <Shadow
        offset={[0, 4]}
        distance={15}
        style={{ borderRadius: 15 }}
        startColor={focused ? '#00000001' : '#00000004'}
        stretch={true}
      >
        {label && <Label>{label}</Label>}
        <InputWrap height={height}>
          <InputField {...textInputProps} onFocus={onFocus} onBlur={onBlur} />
        </InputWrap>
      </Shadow>
      {endIcon && (
        <EndIconWrap disabled={isEndIconDisabled} onPress={onPressAction}>
          <Shadow
            offset={[0, 4]}
            distance={5}
            style={{ borderRadius: 12 }}
            startColor={'#00000007'}
          >
            <EndIcon>{endIcon}</EndIcon>
          </Shadow>
        </EndIconWrap>
      )}
    </Wrap>
  );
};
