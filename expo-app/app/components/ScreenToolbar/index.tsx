import styled from '@emotion/native';
import { Shadow } from 'react-native-shadow-2';
import { BackIcon } from '../../icons/BackIcon';
import { ButtonIcon } from '../ButtonIcon';
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { MenuIcon } from '../../icons/MenuIcon';
import { useDrawerNavigation } from '../../hooks/useDrawerNavigation';

const Wrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 25px;
  padding-right: 25px;
`;

export type ScreenToolbarProps = {
  onPressBack: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

export const ScreenToolbar = ({ onPressBack, style }: ScreenToolbarProps) => {
  const navigation = useDrawerNavigation();
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
