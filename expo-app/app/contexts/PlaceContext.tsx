import styled from '@emotion/native';
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Place } from '../types/Place';
import { Dimensions, BackHandler } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PlaceView } from '../components/PlaceView';
import { ButtonIcon } from '../components/ButtonIcon';
import { BackIcon } from '../icons/BackIcon';
import { useApp } from './AppContext';

const ButtonBack = styled.View``;

export type PlaceContextType = {
  place: Place | null;
  openPlace: (value: Place, onChange?: (place: Place) => void) => void;
};

export const PlaceContext = createContext<PlaceContextType>({
  place: null,
  openPlace: () => {},
});

export type PlaceProviderProps = { children: ReactNode };

export const PlaceProvider = ({ children }: PlaceProviderProps) => {
  const { setStatusBarStyle } = useApp();
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [onCallbacks, setOnCallbacks] = useState<any[]>([]);

  const startX = Dimensions.get('window').width + 10;
  const buttonStartX = (Dimensions.get('window').width + 10) * -1;

  const right = useSharedValue(startX);
  const buttonLeft = useSharedValue(buttonStartX);
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

  const openPlace = useCallback(
    (value: Place, onChange?: (place: Place) => void) => {
      setOnCallbacks([onChange]);
      if (value !== place) {
        setPlace(value);
      } else {
        setOpen(true);
      }
    },
    [place]
  );

  const setTheme = useCallback(() => {
    if (place?.theme === 'dark') {
      setStatusBarStyle('dark');
    } else {
      setStatusBarStyle(open ? 'light' : 'dark');
    }
  }, [place, open]);

  useEffect(() => {
    setOpen(place !== null);
  }, [place]);

  useEffect(() => {
    setTheme();
    right.value = withSpring(open ? 0 : startX, SPRING_CONFIG);
    buttonLeft.value = withSpring(open ? 0 : buttonStartX, SPRING_CONFIG);
  }, [open, setTheme]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        setOpen(false);
        setPlace(null);
        return true;
      }
    );

    return () => backHandler.remove();
  }, [open]);

  return (
    <PlaceContext.Provider value={{ place, openPlace }}>
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
        <PlaceView
          data={place}
          onChange={(newPlace) => {
            setPlace(newPlace);
            if (
              onCallbacks.length > 0 &&
              typeof onCallbacks[0] === 'function'
            ) {
              onCallbacks[0](newPlace);
            }
          }}
        />
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
          <ButtonIcon
            icon={
              <BackIcon fill={place?.theme === 'dark' ? '#fff' : '#222429'} />
            }
            color={place?.theme === 'dark' ? 'blue' : 'white'}
            circle={true}
            touchableProps={{
              onPress: () => {
                setOpen(false);
                setPlace(null);
              },
            }}
          />
        </ButtonBack>
      </Animated.View>
    </PlaceContext.Provider>
  );
};

export const usePlace = () => {
  const context = useContext(PlaceContext);
  if (!context) {
    throw new Error(`Context Place not found`);
  }
  return context;
};
