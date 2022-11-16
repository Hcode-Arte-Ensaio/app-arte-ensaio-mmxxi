import styled from '@emotion/native';
import { Shadow } from 'react-native-shadow-2';
import { BackIcon } from '../../icons/BackIcon';
import { ButtonIcon } from '../ButtonIcon';
import {
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  BackHandler,
} from 'react-native';
import { MenuIcon } from '../../icons/MenuIcon';
import { useDrawerNavigation } from '../../hooks/useDrawerNavigation';
import { useEffect } from 'react';

const Wrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 25px;
  padding-right: 25px;
`;

export type ScreenToolbarProps = {
  onPressBack: (event?: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

export const ScreenToolbar = ({ onPressBack, style }: ScreenToolbarProps) => {
  const navigation = useDrawerNavigation();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        console.log('ScreenToolbar BackHandler');
        onPressBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);
  return (
    <Wrap style={style}>
      <Shadow
        offset={[0, 0]}
        distance={8}
        style={{ borderRadius: 24 }}
        startColor={'#00000020'}
      >
        <ButtonIcon
          icon={<BackIcon />}
          color="white"
          circle={true}
          touchableProps={{ onPress: (e) => onPressBack(e) }}
        />
      </Shadow>
      <ButtonIcon
        icon={<MenuIcon size={32} />}
        touchableProps={{ onPress: () => navigation.toggleDrawer() }}
      />
    </Wrap>
  );
};
