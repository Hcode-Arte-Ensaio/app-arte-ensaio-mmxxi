import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Screens } from '../values/screens';

export function useDrawerNavigation() {
  const navigation = useNavigation<DrawerNavigationProp<typeof Screens>>();
  if (!navigation) {
    throw new Error('useDrawerNavigation() requires @react-navigation/native');
  }
  return navigation;
}
