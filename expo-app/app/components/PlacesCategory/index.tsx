import styled from '@emotion/native';
import { where } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useData } from '../../contexts/DataContext';
import { Category } from '../../types/Category';
import { Place } from '../../types/Place';
import { CategoryList } from '../CategoryList';
import { PlaceThumbList } from '../PlaceThumbList';

const Wrap = styled.View``;

const CategoryListScreen = styled(CategoryList)`
  padding-top: 25px;
  padding-bottom: 10px;
`;

export type PlacesCategoryProps = {
  onAfterInit?: () => void;
};

export const PlacesCategory = ({ onAfterInit }: PlacesCategoryProps) => {
  const isFirstRun = useRef(true);
  const { getPlaces } = useData();
  const { showToast } = useApp();

  const [categorySelected, setCategorySelected] = useState<Category | null>(
    null
  );
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [placesByCategory, setPlacesByCategories] = useState<Place[]>([]);

  useEffect(() => {
    if (categorySelected !== null) {
      setIsLoadingPlaces(true);
      getPlaces({
        where: where('categoryId', '==', categorySelected.id),
      })
        .then((places) => setPlacesByCategories(places))
        .catch(() =>
          showToast(
            `Não foi possível obter os lugares da categoria ${categorySelected.name}.`
          )
        )
        .finally(() => {
          setIsLoadingPlaces(false);
          if (isFirstRun.current) {
            if (typeof onAfterInit === 'function') {
              onAfterInit();
            }
            isFirstRun.current = false;
            return;
          }
        });
    }
  }, [categorySelected, getPlaces]);

  return (
    <Wrap>
      <CategoryListScreen
        onSelect={(category) => setCategorySelected(category)}
      />
      <PlaceThumbList
        places={placesByCategory}
        loading={isLoadingPlaces}
        category={categorySelected}
      />
    </Wrap>
  );
};
