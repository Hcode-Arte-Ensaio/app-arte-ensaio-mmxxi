import styled from '@emotion/native';
import { Picker, PickerProps } from '@react-native-picker/picker';
import { useCallback, useState, ReactNode } from 'react';
import { NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Colors } from '../../values/colors';

const Wrap = styled.View``;

const SelectWrap = styled.View`
  background-color: #fff;
  height: 40px;
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

const SelectField = styled(Picker)`
  padding: 10px 15px;
  padding-right: 40px;
  border-radius: 15px;
  color: ${Colors.Black};
`;

export type SelectProps = {
  label?: string;
  pickerProps?: PickerProps;
  children?: ReactNode;
};

export const Select = ({ pickerProps = {}, label, children }: SelectProps) => {
  const [focused, setFocused] = useState(false);

  const onBlur = useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      if (typeof pickerProps.onBlur === 'function') {
        pickerProps.onBlur(e);
      }

      setFocused(false);
    },
    [pickerProps]
  );

  const onFocus = useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      if (typeof pickerProps.onFocus === 'function') {
        pickerProps.onFocus(e);
      }

      setFocused(true);
    },
    [pickerProps]
  );

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
        <SelectWrap>
          <SelectField {...pickerProps} onFocus={onFocus} onBlur={onBlur}>
            {children}
          </SelectField>
        </SelectWrap>
      </Shadow>
    </Wrap>
  );
};
