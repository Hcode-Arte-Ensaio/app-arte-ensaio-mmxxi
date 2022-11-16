import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Dimensions, BackHandler } from 'react-native';
import styled from '@emotion/native';
import { ButtonIcon } from '../components/ButtonIcon';
import { BackIcon } from '../icons/BackIcon';
import { Shadow } from 'react-native-shadow-2';
import { useApp } from './AppContext';
import { useData } from './DataContext';
import { Photo } from '../types/Photo';

const ButtonBack = styled.View``;

type ImageViewerContextType = {
  openImage: (values: Photo) => void;
};

export const ImageViewerContext = createContext<ImageViewerContextType>({
  openImage: () => {},
});

export type ImageViewerProviderProps = {
  children?: ReactNode;
};

export const ImageViewerProvider = ({ children }: ImageViewerProviderProps) => {
  const { setStatusBarStyle } = useApp();
  const { putPhotoView } = useData();
  const [image, setImage] = useState<Photo | null>(null);
  const [open, setOpen] = useState(false);

  const startY = Dimensions.get('window').height + 10;
  const buttonStartX = (Dimensions.get('window').width + 10) * -1;

  const imageOpacity = useSharedValue(0);
  const topY = useSharedValue(startY);
  const buttonLeft = useSharedValue(buttonStartX);

  const SPRING_CONFIG = {
    damping: 80,
    stiffness: 500,
  };

  const animatedImageViewStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
      transform: [
        {
          translateX: topY.value,
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

  const openImage = useCallback(
    (value: Photo) => {
      setImage(value);
      if (!open) {
        setOpen(true);
      }
    },
    [open]
  );

  useEffect(() => {
    setOpen(image !== null);
  }, [image]);

  useEffect(() => {
    setStatusBarStyle(open ? 'light' : 'dark');
    imageOpacity.value = withSpring(open ? 1 : 0, SPRING_CONFIG);
    topY.value = withSpring(open ? 0 : startY, SPRING_CONFIG);
    buttonLeft.value = withSpring(open ? 0 : buttonStartX, SPRING_CONFIG);

    if (open) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          setOpen(false);
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [open]);

  useEffect(() => {
    if (image) {
      putPhotoView(image.id).finally(() => {});
    }
  }, [image, putPhotoView]);

  return (
    <ImageViewerContext.Provider value={{ openImage }}>
      {children}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 102,
            backgroundColor: 'black',
          },
          animatedImageViewStyle,
        ]}
      >
        {image && (
          <ImageViewer
            imageUrls={[
              {
                url: image.url,
              },
            ]}
          />
        )}
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
            startColor={'#FFFFFF20'}
          >
            <ButtonIcon
              icon={<BackIcon />}
              color="white"
              circle={true}
              touchableProps={{ onPress: () => setOpen(false) }}
            />
          </Shadow>
        </ButtonBack>
      </Animated.View>
    </ImageViewerContext.Provider>
  );
};

export const useImageViewer = () => {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error('Context Photos not found');
  }
  return context;
};
