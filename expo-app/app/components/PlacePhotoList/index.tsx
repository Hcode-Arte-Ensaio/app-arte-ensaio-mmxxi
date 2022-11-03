import styled from '@emotion/native';
import {
  ViewStyle,
  StyleProp,
  NativeSyntheticEvent,
  NativeScrollEvent,
  VirtualizedList,
} from 'react-native';
import { Photo } from '../../types/Photo';
import { PlacePhotoItem } from '../PlacePhotoItem';
import { useState, useEffect } from 'react';

const Wrap = styled.View`
  margin-bottom: 20px;
`;

const PhotoItemItem = styled(PlacePhotoItem)``;

export type PlacePhotoListProps = {
  style?: StyleProp<ViewStyle>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  data: Photo[];
};

export const PlacePhotoList = ({
  style,
  onScroll,
  data,
}: PlacePhotoListProps) => {
  const [items, setItems] = useState<Photo[]>([]);
  useEffect(() => setItems(data), [data]);
  return (
    <Wrap style={style}>
      <VirtualizedList<Photo>
        data={items}
        initialNumToRender={2}
        renderItem={({ item, index }) => (
          <PhotoItemItem key={index} data={item} />
        )}
        keyExtractor={(item, index) => String(index + '-' + item.url)}
        getItemCount={() => items.length}
        getItem={(data, index) => data[index]}
        onScroll={onScroll}
      />
    </Wrap>
  );
};
