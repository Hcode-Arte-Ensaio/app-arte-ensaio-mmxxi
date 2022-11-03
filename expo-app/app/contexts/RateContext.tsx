import styled from '@emotion/native';
import {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { OverlayView } from '../components/OverlayView';
import { Place } from '../types/Place';
import { Dimensions } from 'react-native';
import { Canvas } from '../components/Canvas';
import { Button } from '../components/Button';
import { Colors, ColorsBackground } from '../values/colors';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { RatingStarInput } from '../components/RatingStarInput';
import { useApp } from './AppContext';
import { useData } from './DataContext';

const PlaceCover = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 24px;
  position: absolute;
  top: -75px;
`;

const Panel = styled(Canvas)`
  border-radius: 20px;
  margin-bottom: 25px;
  padding: 15px;
  align-items: center;
  min-height: 275px;
  padding-top: 100px;
`;

const CategoryText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${Colors.Gray};
`;
const Questiontext = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${Colors.Gray};
`;
const PlaceTitleText = styled.Text`
  font-size: 24px;
  line-height: 42px;
  font-weight: 500;
  color: ${Colors.Black};
`;

type RateContextType = {
  openRate: (place: Place) => void;
};

export const RateContext = createContext<RateContextType>({
  openRate: () => {},
});

export type RateProviderProps = {
  children: ReactNode;
};

export const RateProvider = ({ children }) => {
  const { setStatusBarStyle, showToast } = useApp();
  const { putRate } = useData();
  const startY = (Dimensions.get('window').height + 10) * -1;
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<number>(0);

  const bottom = useSharedValue(startY);

  const openRate = useCallback(
    (value: Place) => {
      if (value !== place) {
        setPlace(value);
      } else {
        setOpen(true);
      }
    },
    [place]
  );

  const SPRING_CONFIG = {
    damping: 80,
    stiffness: 500,
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: bottom.value * -1,
        },
      ],
    };
  });

  const onSubmit = useCallback(() => {
    if (place) {
      setLoading(true);
      putRate(place.id, value)
        .then(() => {
          setOpen(false);
          setPlace(null);
          setValue(0);
          showToast('Obrigado, sua avaliação foi registrada!');
        })
        .finally(() => setLoading(false));
    }
  }, [place, value]);

  useEffect(() => {
    setOpen(place !== null);
  }, [place]);

  useEffect(() => {
    setStatusBarStyle(open ? 'light' : 'dark');
    bottom.value = withSpring(open ? 0 : startY, SPRING_CONFIG);
  }, [open]);

  return (
    <RateContext.Provider value={{ openRate }}>
      {children}
      {open && <OverlayView onPress={() => setOpen(false)} />}
      <TapGestureHandler>
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 100,
              padding: 25,
            },
            animatedStyle,
          ]}
        >
          {place && (
            <Panel colors={ColorsBackground}>
              <PlaceCover source={{ uri: place.cover.url }} />
              <CategoryText>{place.category.singular}</CategoryText>
              <PlaceTitleText>{place.title}</PlaceTitleText>
              <Questiontext>O que você achou deste lugar?</Questiontext>
              <RatingStarInput
                value={value}
                size={52}
                onChange={(rateValue) => setValue(rateValue)}
              />
            </Panel>
          )}
          <Button
            propsTouchable={{ onPress: () => onSubmit() }}
            loading={loading}
          >
            Enviar avaliação
          </Button>
        </Animated.View>
      </TapGestureHandler>
    </RateContext.Provider>
  );
};

export const useRate = () => {
  const context = useContext(RateContext);
  if (!context) {
    throw new Error('Not found Rate context.');
  }
  return context;
};
