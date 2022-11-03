import styled from '@emotion/native';
import {
  ViewStyle,
  StyleProp,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { UserPhotoItem } from '../UserPhotoItem';

const Wrap = styled.View`
  margin-bottom: 20px;
`;
const ScrollView = styled.ScrollView``;
const PhotoItemItem = styled(UserPhotoItem)``;

export type UserPhotoListProps = {
  style?: StyleProp<ViewStyle>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export const UserPhotoList = ({ style, onScroll }: UserPhotoListProps) => {
  return (
    <Wrap style={style}>
      <ScrollView onScroll={onScroll}>
        <PhotoItemItem />
        <PhotoItemItem />
        <PhotoItemItem />
        <PhotoItemItem />
        <PhotoItemItem />
      </ScrollView>
    </Wrap>
  );
};
