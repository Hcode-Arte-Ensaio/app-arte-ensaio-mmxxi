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
import { Dimensions } from 'react-native';

const Wrap = styled.View`
  margin-bottom: 20px;
  height: ${String(Dimensions.get('window').height - 96)}px;
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
  const [items, setItems] = useState<Photo[]>(data);
  useEffect(() => {
    setItems(data);
  }, [data]);
  return (
    <Wrap style={style}>
      {items.length > 0 && (
        <VirtualizedList<Photo>
          data={items}
          extraData={items}
          initialNumToRender={2}
          renderItem={({ item, index }) => (
            <PhotoItemItem key={String(index + '-' + item.url)} data={item} />
          )}
          keyExtractor={(item, index) => String(index + '-' + item.url)}
          getItemCount={() => items.length}
          getItem={(data, index) => data[index]}
          onScroll={onScroll}
        />
      )}
    </Wrap>
  );
};
