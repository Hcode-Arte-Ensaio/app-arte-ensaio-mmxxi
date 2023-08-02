import styled from '@emotion/native';
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import FadeCarousel from 'rn-fade-carousel';
import Image1 from '../../assets/main/sp1.jpg';
import Image2 from '../../assets/main/sp2.jpg';
import Image3 from '../../assets/main/sp3.jpg';
import Image4 from '../../assets/main/sp4.jpg';
import Image5 from '../../assets/main/sp5.jpg';
import spCultura from '../../assets/sp-cultura.png';
import conexao from '../../assets/conexao.png';
import { Button } from '../components/Button';
import { Dimensions } from 'react-native';
import { useApp } from './AppContext';

const ButtonOverlay = styled.TouchableOpacity`
  flex: 1;
`;

const LogoWrap = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  margin-top: 100px;
  margin-bottom: 40px;
`;

const ImageWrap = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
`;

const Photo = styled.Image`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const InnerContainer = styled.View`
  position: absolute;
  border-width: 2px;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: space-between;
  padding: 25px;
  padding-top: 0;
`;

const LogoImage = styled.Image`
  width: 100%;
  margin: 0;
  height: 100px;
  align-items: flex-start;
`;

const P = styled.Text`
  font-size: 20px;
  margin-left: 60px;
  margin-right: 60px;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
`;

const LogoConexao = styled.Image`
  width: 100%;
  height: 90px;
`;

type StartContextType = {
  setOpen: (value: boolean) => void;
  setLoading: (value: boolean) => void;
};

export const StartContext = createContext<StartContextType>({
  setOpen: () => {},
  setLoading: () => {},
});

export type StartProviderProps = {
  children: ReactNode;
};

export const StartProvider = ({ children }: StartProviderProps) => {
  const { setStatusBarStyle } = useApp();
  const startY = Dimensions.get('window').height + 50;
  const [open, setOpen] = useState(true);
  const bottom = useSharedValue(startY);
  const [loading, setLoading] = useState(true);

  const SPRING_CONFIG = {
    damping: 80,
    stiffness: 500,
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: bottom.value,
        },
      ],
    };
  });

  const opacityText1 = useSharedValue(0);

  const animatedText1Style = useAnimatedStyle(() => {
    return {
      opacity: opacityText1.value,
    };
  });

  const opacityText2 = useSharedValue(0);

  const animatedText2Style = useAnimatedStyle(() => {
    return {
      opacity: opacityText2.value,
    };
  });

  const opacityText3 = useSharedValue(0);

  const animatedText3Style = useAnimatedStyle(() => {
    return {
      opacity: opacityText3.value,
    };
  });

  useEffect(() => {
    setStatusBarStyle(open ? 'light' : 'dark');
    bottom.value = withSpring(open ? 0 : startY, SPRING_CONFIG);

    opacityText1.value = withTiming(
      1,
      {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
      () => {
        opacityText2.value = withTiming(
          1,
          {
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          },
          () => {
            opacityText3.value = withTiming(
              1,
              {
                duration: 1000,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              },
              () => console.log('finish')
            );
          }
        );
      }
    );
  }, [open]);

  return (
    <StartContext.Provider value={{ setOpen, setLoading }}>
      {children}
      <Animated.View
        style={[
          { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
          animatedStyle,
        ]}
      >
        <ButtonOverlay
          activeOpacity={0.8}
          onPress={() => {
            if (!loading) {
              setOpen(false);
            }
          }}
        >
          <FadeCarousel
            elements={[
              <Photo
                source={Image1}
                resizeMethod="resize"
                resizeMode="cover"
              />,
              <Photo
                source={Image2}
                resizeMethod="resize"
                resizeMode="cover"
              />,
              <Photo
                source={Image3}
                resizeMethod="resize"
                resizeMode="cover"
              />,
              <Photo
                source={Image4}
                resizeMethod="resize"
                resizeMode="cover"
              />,
              <Photo
                source={Image5}
                resizeMethod="resize"
                resizeMode="cover"
              />,
            ]}
            containerStyle={{
              height: Dimensions.get('window').height,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            fadeDuration={2000}
            stillDuration={2000}
            start={true}
          />
          <InnerContainer>
            <Animated.View style={animatedText1Style}>
              <LogoWrap>
                <LogoImage source={spCultura} resizeMode="contain" />
              </LogoWrap>
            </Animated.View>
            <Animated.View style={animatedText2Style}>
              <P>
                  Secretaria Municipal de Cultura de São Paulo
              </P>
              <P>Apresenta:</P>
            </Animated.View>
            <Animated.View style={animatedText3Style}>
              <ImageWrap>
                <LogoConexao source={conexao} resizeMode="contain" />
              </ImageWrap>
            </Animated.View>
            <Button
              color="outlined"
              loading={loading}
              propsTouchable={{
                onPress: () => {
                  if (!loading) {
                    setOpen(false);
                  }
                },
                activeOpacity: 0.5,
              }}
            >
              Conheça SAMPA
            </Button>
          </InnerContainer>
        </ButtonOverlay>
      </Animated.View>
    </StartContext.Provider>
  );
};

export const useStart = () => {
  const context = useContext(StartContext);
  if (!context) {
    throw new Error('Start context not found');
  }
  return context;
};
