import styled from '@emotion/native';
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions, Platform, ActivityIndicator } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { Button } from '../components/Button';
import { ButtonIcon } from '../components/ButtonIcon';
import { Canvas } from '../components/Canvas';
import { PlacePhotoList } from '../components/PlacePhotoList';
import { UserPhotoList } from '../components/UserPhotoList';
import { BackIcon } from '../icons/BackIcon';
import { CameraIcon } from '../icons/CameraIcon';
import { GalleryIcon } from '../icons/GalleryIcon';
import { Place } from '../types/Place';
import { User } from '../types/User';
import { Colors, ColorsBackground } from '../values/colors';
import { useApp } from './AppContext';
import { useData } from './DataContext';
import { Photo } from '../types/Photo';
import { useAuth } from './AuthContext';
import ProgressDialog from 'react-native-progress-dialog';
import { where } from 'firebase/firestore';

const ButtonBack = styled.View``;

const HeaderTitle = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  padding-left: 20px;
`;

const HeaderTitleText = styled.Text<{ size: number }>`
  font-size: ${(props) => (props.size > 0 ? String(props.size) : '22')}px;
  font-weight: 500;
  color: ${Colors.Black};
`;
const HeaderSubtitleText = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: ${Colors.Gray};
`;

const FloatButton = styled.View`
  position: absolute;
  bottom: 25px;
  left: 25px;
  right: 25px;
`;

type PhotosContextType = {
  openPhotos: (value: Place, onChange: (photos: Photo[]) => void) => void;
};

export const PhotosContext = createContext<PhotosContextType>({
  openPhotos: () => {},
});

export type PhotosProviderProps = {
  children?: ReactNode;
};

export const PhotosProvider = ({ children }: PhotosProviderProps) => {
  const { user: isLogged, setOpen: setOpenLogin } = useAuth();
  const { setStatusBarStyle, showToast } = useApp();
  const { uploadFile, putPhoto, getPhotos, getPlaces } = useData();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [open, setOpen] = useState(false);
  const startX = Dimensions.get('window').width + 10;
  const buttonStartX = (Dimensions.get('window').width + 10) * -1;
  const headerStartY = -100;
  const right = useSharedValue(startX);
  const buttonLeft = useSharedValue(buttonStartX);
  const headerTop = useSharedValue(headerStartY);
  const scrollPercent = useSharedValue(0);
  const [onCallbacks, setOnCallbacks] = useState<any[]>([]);

  const SPRING_CONFIG = {
    damping: 80,
    stiffness: 500,
  };

  const animatedWrapStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: right.value,
        },
      ],
    };
  });

  const animatedBackButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: buttonLeft.value,
        },
      ],
    };
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: headerTop.value,
        },
      ],
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollPercent.value,
        [0, 33],
        [1, 0],
        Extrapolate.CLAMP
      ),
    };
  }, [scrollPercent]);

  const openPhotos = useCallback(
    (value: Place, onChange: (photos: Photo[]) => void) => {
      setOnCallbacks([onChange]);
      setPhotos([]);
      setPlace(value);
      setOpen(true);
    },
    []
  );

  const onScroll = useCallback((e) => {
    const total = e.nativeEvent.layoutMeasurement.height;
    const compare = e.nativeEvent.contentOffset.y;
    const porcent = (compare * 100) / total;
    scrollPercent.value = porcent;
  }, []);

  const handleImagePicked = useCallback(
    (result) => {
      setIsLoadingPhoto(true);
      if (!result.cancelled && place) {
        uploadFile(result.uri)
          .then((url) => {
            return putPhoto(place.id, url);
          })
          .then((photo) => {
            return getPhotos([photo.id], 0);
          })
          .then((results) => {
            setPhotos([...results, ...photos]);
            if (
              onCallbacks.length > 0 &&
              typeof onCallbacks[0] === 'function'
            ) {
              onCallbacks[0]([...results, ...photos]);
            }
          })
          .finally(() => {
            showToast('Foto adicionada com sucesso!');
          })
          .catch((error) => {
            showToast(error.message);
          })
          .finally(() => setIsLoadingPhoto(false));
      }
    },
    [place, putPhoto, uploadFile, photos]
  );

  const checkPermissions = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (Platform.OS !== 'web') {
        ImagePicker.requestMediaLibraryPermissionsAsync()
          .then(({ status }) => {
            if (status !== 'granted') {
              reject('Desculpe, precisamos de permissão para este recurso!');
            } else {
              resolve();
            }
          })
          .catch((error) => showToast(error.message));
      } else {
        reject('A câmera não está disponível na web.');
      }
    });
  }, [showToast]);

  const pickerCamera = useCallback(() => {
    if (!isLogged) {
      setOpenLogin(true);
    } else {
      checkPermissions()
        .then(() => {
          return ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });
        })
        .then((result) => {
          if (!result.cancelled) {
            handleImagePicked(result);
          }
        })
        .catch((error) => showToast(error.message));
    }
  }, [handleImagePicked, checkPermissions, showToast]);

  const pickerGallery = useCallback(() => {
    if (!isLogged) {
      setOpenLogin(true);
    } else {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      })
        .then((result) => {
          if (!result.cancelled) {
            handleImagePicked(result);
          }
        })
        .catch((error) => showToast(error.message))
        .finally();
    }
  }, [handleImagePicked, showToast]);

  useEffect(() => {
    setStatusBarStyle(open ? 'dark' : 'light');
    right.value = withSpring(open ? 0 : startX, SPRING_CONFIG);
    buttonLeft.value = withSpring(open ? 0 : buttonStartX, SPRING_CONFIG);
    headerTop.value = withSpring(open ? 30 : headerStartY, SPRING_CONFIG);
  }, [open]);

  useEffect(() => {
    setPhotos([]);
    if (place) {
      setIsLoading(true);
      getPlaces({ where: where('id', 'in', [place.id]) })
        .then((places) => {
          if (places.length > 0) {
            return getPhotos(places[0].photos, 0);
          }
        })
        .then(setPhotos)
        .finally(() => setIsLoading(false));
    }
  }, [place, getPhotos, getPlaces]);

  return (
    <PhotosContext.Provider value={{ openPhotos }}>
      {children}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          },
          animatedWrapStyle,
        ]}
      >
        <Canvas
          colors={ColorsBackground}
          style={{
            paddingTop: 28 + 68,
            marginBottom: -20,
          }}
        >
          {isLoading && <ActivityIndicator color={Colors.Blue} />}
          {!isLoading && place && (
            <PlacePhotoList data={photos} onScroll={onScroll} />
          )}
        </Canvas>

        <Animated.View style={animatedButtonStyle}>
          {place && (
            <FloatButton>
              <Button
                loading={isLoadingPhoto}
                split={[
                  {
                    text: 'Câmera',
                    icon: <CameraIcon size={24} fill="#fff" />,
                    onPress: () => pickerCamera(),
                  },
                  {
                    text: 'Galeria',
                    icon: <GalleryIcon size={24} fill="#fff" />,
                    onPress: () => pickerGallery(),
                  },
                ]}
              />
            </FloatButton>
          )}
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 25,
            top: 35,
            zIndex: 101,
          },
          animatedBackButtonStyle,
        ]}
      >
        <ButtonBack>
          <Shadow
            offset={[0, 0]}
            distance={8}
            style={{ borderRadius: 24 }}
            startColor={'#00000020'}
          >
            <ButtonIcon
              icon={<BackIcon />}
              color="white"
              circle={true}
              touchableProps={{
                onPress: () => {
                  setPlace(null);
                  setPhotos([]);
                  setOpen(false);
                },
              }}
            />
          </Shadow>
        </ButtonBack>
      </Animated.View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 50,
            top: 0,
            zIndex: 101,
          },
          animatedHeaderStyle,
        ]}
      >
        {place && (
          <HeaderTitle>
            <HeaderTitleText size={18}>
              {place?.address?.street}
              {place?.address?.number ? `, ${place?.address?.number}` : ''}
            </HeaderTitleText>
            <HeaderSubtitleText>{place?.address?.district}</HeaderSubtitleText>
          </HeaderTitle>
        )}
      </Animated.View>
      <ProgressDialog
        visible={isLoadingPhoto}
        label="Enviando foto..."
        loaderColor={Colors.Blue}
      />
    </PhotosContext.Provider>
  );
};

export const usePhotos = () => {
  const context = useContext(PhotosContext);
  if (!context) {
    throw new Error('Context Photos not found');
  }
  return context;
};
