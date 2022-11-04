import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screens, Screen } from '../values/screens';
import { ScreenProvider } from '../contexts/ScreenContext';
import { ScreenContent } from '../components/ScreenContent';
import { ColorsBackground } from '../values/colors';
import { ScreenToolbar } from '../components/ScreenToolbar';
import { H1 } from '../components/H1';
import { PhotoList } from '../components/PhotoList';
import { useCallback, useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Photo } from '../types/Photo';

type PhotosScreenProps = NativeStackScreenProps<typeof Screens, Screen.Photos>;

export const PhotosScreen = ({ navigation }: PhotosScreenProps) => {
  const [items, setItems] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const { getUserPhotos, watchUserPhotos } = useData();

  const getReloadDataScreen = useCallback(() => {
    setLoading(true);
    getUserPhotos()
      .then((photos) => {
        setItems([...photos]);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [getUserPhotos]);

  useEffect(() => {
    setLoading(true);
    const ubsubscribe = watchUserPhotos((photos) => {
      setItems([...photos]);
      setLoading(false);
    });
    return () => {
      if (typeof ubsubscribe === 'function') {
        ubsubscribe();
      }
    };
  }, [watchUserPhotos]);

  useEffect(() => getReloadDataScreen(), [getReloadDataScreen]);

  return (
    <ScreenProvider>
      <ScreenContent colors={ColorsBackground} style={{ height: 'auto' }}>
        <ScreenToolbar onPressBack={() => navigation.navigate(Screen.Places)} />
        <H1 blackText="Minhas" redText="Fotos" />
        <PhotoList
          data={items}
          loading={loading}
          onRefresh={getReloadDataScreen}
        />
      </ScreenContent>
    </ScreenProvider>
  );
};
