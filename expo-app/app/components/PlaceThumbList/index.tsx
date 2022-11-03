import styled from '@emotion/native';
import { Place } from '../../types/Place';
import { Colors } from '../../values/colors';
import { PlaceThumb } from '../PlaceThumb';
import { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Category } from '../../types/Category';

const Wrap = styled.View``;
const List = styled.ScrollView``;
const TotalText = styled.Text`
  margin-left: 25px;
  color: ${Colors.Gray};
  font-size: 12px;
`;

const PlaceThumbItem = styled(PlaceThumb)`
  margin: 25px;
  margin-right: 0;
  margin-top: 15px;
`;

const PlaceHolder = styled.View`
  width: 300px;
  height: 340px;
  border-radius: 18px;
  background-color: #ddd;
  margin: 25px;
  margin-right: 0;
  margin-top: 15px;
  position: relative;
`;

const PlaceHolderTitleA = styled.View`
  position: absolute;
  background-color: #ccc;
  width: 150px;
  height: 30px;
  bottom: 20px;
  left: 20px;
`;

const PlaceHolderTitleB = styled.View`
  position: absolute;
  background-color: #ccc;
  width: 180px;
  height: 30px;
  bottom: 60px;
  left: 20px;
`;

const PlaceHolderCircle = styled.View`
  position: absolute;
  background-color: #ccc;
  width: 50px;
  height: 50px;
  top: 25px;
  right: 25px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
`;

export type PlaceThumbListProps = {
  places?: Place[];
  loading?: boolean;
  category?: Category;
};

export const PlaceThumbList = ({
  places = [],
  loading = false,
  category,
}: PlaceThumbListProps) => {
  const [items, setItems] = useState<Place[]>(places);
  const [isLoading, setIsLoading] = useState(loading);
  const [selectedCategory, setSelectedCategory] = useState(category);
  useEffect(() => setItems(places), [places]);
  useEffect(() => setIsLoading(loading), [loading]);
  useEffect(() => setSelectedCategory(category), [category]);
  return (
    <Wrap>
      {selectedCategory && (
        <TotalText>
          {isLoading
            ? 'Carregando...'
            : `${items.length} ` +
              (items.length > 1
                ? selectedCategory.name
                : selectedCategory.singular)}
        </TotalText>
      )}
      <List horizontal={true} showsHorizontalScrollIndicator={false}>
        {isLoading && (
          <PlaceHolder>
            <PlaceHolderTitleA />
            <PlaceHolderTitleB />
            <PlaceHolderCircle>
              <ActivityIndicator size={16} color="#AAA" />
            </PlaceHolderCircle>
          </PlaceHolder>
        )}
        {!isLoading &&
          items.map((item, index) => (
            <PlaceThumbItem
              data={item}
              key={item.id}
              style={{ marginRight: index + 1 === items.length ? 25 : 0 }}
            />
          ))}
      </List>
    </Wrap>
  );
};
