import styled from '@emotion/native';
import {
  ViewStyle,
  StyleProp,
  NativeSyntheticEvent,
  NativeScrollEvent,
  VirtualizedList,
  Dimensions,
} from 'react-native';
import { Photo } from '../../types/Photo';
import { PhotoItem } from '../PhotoItem';
import { useState, useEffect } from 'react';

const Wrap = styled.View`
  margin-bottom: 20px;
  height: ${String(Dimensions.get('window').height - 157)}px;
`;

const PhotoItemItem = styled(PhotoItem)``;

export type PhotoListProps = {
  style?: StyleProp<ViewStyle>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  data: Photo[];
  loading?: boolean;
};

export const PhotoList = ({
  style,
  data,
  onScroll,
  loading,
}: PhotoListProps) => {
  const [items, setItems] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(loading);
  useEffect(() => setItems(data), [data]);
  useEffect(() => setIsLoading(loading), [loading]);
  return (
    <Wrap style={style}>
      {!isLoading && (
        <VirtualizedList<Photo>
          data={items}
          extraData={items}
          initialNumToRender={2}
          renderItem={({ item, index }) => (
            <PhotoItemItem
              key={index}
              data={item}
              onDelete={(item) =>
                setItems([...items.filter((i) => i.id !== item.id)])
              }
            />
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
