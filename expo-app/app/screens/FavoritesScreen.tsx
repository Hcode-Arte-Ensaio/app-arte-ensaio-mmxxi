import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screens, Screen } from '../values/screens';
import { ScreenProvider } from '../contexts/ScreenContext';
import { ScreenContent } from '../components/ScreenContent';
import { ColorsBackground } from '../values/colors';
import { ScreenToolbar } from '../components/ScreenToolbar';
import { H1 } from '../components/H1';
import { PlaceList } from '../components/PlaceList';
import { useData } from '../contexts/DataContext';
import { Place } from '../types/Place';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import styled from '@emotion/native';

const ScrollView = styled.ScrollView``;

type FavoritesScreenProps = NativeStackScreenProps<
  typeof Screens,
  Screen.Favorites
>;

export const FavoritesScreen = ({ navigation }: FavoritesScreenProps) => {
  const [items, setItems] = useState<Place[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { getPlacesFavorites, watchPlacesFavorites } = useData();

  const getReloadDataScreen = useCallback(() => {
    setLoading(true);
    getPlacesFavorites(page)
      .then((places) => {
        setItems(places);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    setLoading(true);
    const ubsubscribe = watchPlacesFavorites((places) => {
      setPage(0);
      setItems(places);
      setLoading(false);
    }, page);
    return () => {
      if (typeof ubsubscribe === 'function') {
        ubsubscribe();
      }
    };
  }, [watchPlacesFavorites, page]);

  useEffect(() => getReloadDataScreen(), [getReloadDataScreen]);

  return (
    <ScreenProvider>
      <ScreenContent colors={ColorsBackground}>
        <ScreenToolbar onPressBack={() => navigation.navigate(Screen.Places)} />
        <H1 blackText="Meus" redText={'Favoritos'} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => getReloadDataScreen()}
            />
          }
        >
          <PlaceList data={items} loading={loading} />
        </ScrollView>
      </ScreenContent>
    </ScreenProvider>
  );
};
