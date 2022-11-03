import styled from '@emotion/native';
import {
  ViewStyle,
  StyleProp,
  Dimensions,
  ActivityIndicator,
  VirtualizedList,
} from 'react-native';
import { Place } from '../../types/Place';
import { PlaceItem } from '../PlaceItem';
import { useState, useEffect } from 'react';
import { FlashList } from '@shopify/flash-list';

const Wrap = styled.View`
  margin-bottom: 20px;
`;

const PlaceListItem = styled(PlaceItem)``;

const PlaceHolder = styled.View`
  border-radius: 15px;
  height: 75px;
  width: ${String(parseInt(String(Dimensions.get('window').width - 50)))}px;
  flex-direction: row;
  padding: 10px;
  background-color: #ddd;
  padding: 10px 0px;
  position: relative;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const PlaceHolderTitleA = styled.View`
  position: absolute;
  background-color: #ccc;
  width: 150px;
  height: 20px;
  top: 10px;
  left: 75px;
`;

const PlaceHolderTitleB = styled.View`
  position: absolute;
  background-color: #ccc;
  width: 200px;
  height: 20px;
  top: 40px;
  left: 75px;
`;

const PlaceHolderThumb = styled.View`
  position: absolute;
  background-color: #ccc;
  width: 55px;
  height: 55px;
  border-radius: 10px;
  margin-right: 15px;
  top: 10px;
  left: 10px;
  justify-content: center;
  align-items: center;
`;

export type PlaceListProps = {
  style?: StyleProp<ViewStyle>;
  data?: Place[];
  loading?: boolean;
};

export const PlaceList = ({
  style,
  data = [],
  loading = false,
}: PlaceListProps) => {
  const [items, setItems] = useState<Place[]>(data);
  const [isLoading, setIsLoading] = useState(loading);
  useEffect(() => setIsLoading(loading), [loading]);
  useEffect(() => {
    setItems([...data]);
  }, [data]);

  return (
    <Wrap style={style}>
      {isLoading &&
        [0, 0, 0, 0, 0].map((_value, index) => (
          <PlaceHolder style={{ marginHorizontal: 25 }} key={index}>
            <PlaceHolderTitleA />
            <PlaceHolderTitleB />
            <PlaceHolderThumb>
              <ActivityIndicator size={16} color="#AAA" />
            </PlaceHolderThumb>
          </PlaceHolder>
        ))}
      {!isLoading && (
        <VirtualizedList<Place>
          data={items}
          initialNumToRender={6}
          renderItem={({ item, index }) => (
            <PlaceListItem key={index} data={item} />
          )}
          keyExtractor={(item, index) => String(index + '-' + item.id)}
          getItemCount={() => items.length}
          getItem={(data, index) => data[index]}
        />
      )}
    </Wrap>
  );
};
