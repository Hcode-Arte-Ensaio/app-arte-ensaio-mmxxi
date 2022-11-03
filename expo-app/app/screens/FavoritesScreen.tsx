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

type FavoritesScreenProps = NativeStackScreenProps<
  typeof Screens,
  Screen.Favorites
>;

export const FavoritesScreen = ({ navigation }: FavoritesScreenProps) => {
  const [items, setItems] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const { getPlacesFavorites, watchPlacesFavorites } = useData();

  const getReloadDataScreen = useCallback((finish) => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      getPlacesFavorites()
        .then((places) => {
          setItems(places);
          resolve();
        })
        .catch(reject)
        .finally(() => {
          finish();
          setLoading(false);
        });
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const ubsubscribe = watchPlacesFavorites((places) => {
      setItems(places);
      setLoading(false);
    });
    return () => ubsubscribe();
  }, [watchPlacesFavorites]);

  return (
    <ScreenProvider onRefresh={getReloadDataScreen}>
      <ScreenContent colors={ColorsBackground}>
        <ScreenToolbar onPressBack={() => navigation.navigate(Screen.Places)} />
        <H1 blackText="Meus" redText="Favoritos" />
        <PlaceList data={items} loading={loading} />
      </ScreenContent>
    </ScreenProvider>
  );
};
