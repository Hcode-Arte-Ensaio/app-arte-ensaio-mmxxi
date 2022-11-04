import styled from '@emotion/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screens, Screen } from '../values/screens';
import { Input } from '../components/Input';
import { H1 } from '../components/H1';
import { SearchIcon } from '../icons/SearchIcon';
import { H2 } from '../components/H2';
import { PlaceList } from '../components/PlaceList';
import { ScreenProvider } from '../contexts/ScreenContext';
import { HeaderAvatar } from '../components/HeaderAvatar';
import { useStart } from '../contexts/StartContext';
import conexaoArte from '../../assets/partners/conexao-arte.png';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { Button } from '../components/Button';
import { useData } from '../contexts/DataContext';
import { Place } from '../types/Place';
import { PlacesCategory } from '../components/PlacesCategory';
import { PaddingSides } from '../components/PaddingSides';

const ScreenContent = styled.View`
  flex: 1;
`;

const LogoFooterWrap = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 25px;
`;

const LogoFooter = styled.Image`
  height: 48px;
`;

const Relative = styled.View`
  position: relative;
`;

const ScrollView = styled.ScrollView`
  flex: 1;
`;

type PlacesScreenProps = NativeStackScreenProps<typeof Screens, Screen.Places>;

export const PlacesScreen = ({ navigation }: PlacesScreenProps) => {
  const startHomeX = 0;
  const startFoundX = Dimensions.get('window').width * -1;
  const leftHome = useSharedValue(startHomeX);
  const leftFound = useSharedValue(startFoundX);

  const { setLoading: setLoadingStart } = useStart();
  const { getPlacesTop, getPlacesSearch } = useData();
  const { showToast } = useApp();
  const [searchShow, setSearchShow] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingPlacesTop, setIsLoadingPlacesTop] = useState(false);
  const [placesTop, setPlacesTop] = useState<Place[]>([]);
  const [placesFound, setPlacesFound] = useState<Place[]>([]);

  const SPRING_CONFIG = {
    damping: 80,
    stiffness: 500,
  };

  const submitSearch = useCallback(() => {
    if (!search) {
      return showToast('Preencha o campo procurar!');
    }
    setIsLoadingSearch(true);
    setSearchShow(true);

    getPlacesSearch(search)
      .then((places) => {
        setPlacesFound(places);
      })
      .catch((e) => {
        showToast(`Não foi possível obter os lugares pesquisados.`);
      })
      .finally(() => {
        setIsLoadingSearch(false);
      });
  }, [search]);

  const animatedHomeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: leftHome.value,
        },
      ],
    };
  });

  const animatedFoundStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: leftFound.value,
        },
      ],
    };
  });

  const clearSearchResult = useCallback(() => {
    setSearch('');
    setIsLoadingSearch(false);
    setSearchShow(false);
  }, []);

  const getReloadDataScreen = useCallback(() => {
    setIsLoadingPlacesTop(true);
    getPlacesTop()
      .then((places) => {
        setPlacesTop(places);
      })
      .catch(() => {
        showToast(`Não foi possível obter os lugares populares.`);
      })
      .finally(() => {
        setIsLoadingPlacesTop(false);
      });
  }, []);

  useEffect(() => {
    leftHome.value = withSpring(
      searchShow ? Dimensions.get('window').width : startHomeX,
      SPRING_CONFIG
    );
    leftFound.value = withSpring(searchShow ? 0 : startFoundX, SPRING_CONFIG);
  }, [searchShow]);

  return (
    <ScreenProvider>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoadingPlacesTop}
            onRefresh={getReloadDataScreen}
          />
        }
      >
        <HeaderAvatar />
        <ScreenContent>
          <PaddingSides>
            <H1 blackText="Explore" redText="São Paulo" />
            <Input
              textInputProps={{
                placeholder: 'Procurar por lugares...',
                value: search,
                onChangeText: (value) => setSearch(value),
                returnKeyType: 'search',
                onSubmitEditing: () => submitSearch(),
                clearButtonMode: 'while-editing',
              }}
              endIconDisabled={isLoadingSearch}
              endIcon={
                isLoadingSearch ? (
                  <ActivityIndicator size={16} color="#FF3D46" />
                ) : (
                  <SearchIcon />
                )
              }
              onPressAction={() => submitSearch()}
            />
          </PaddingSides>
          <Relative>
            <Animated.View style={[animatedHomeStyle]}>
              <PlacesCategory
                onAfterInit={() => {
                  getReloadDataScreen();
                  setLoadingStart(false);
                }}
              />
              {placesTop.length > 0 && (
                <PaddingSides>
                  <H2 title="Popular" />
                </PaddingSides>
              )}
              {placesTop.length > 0 && (
                <PlaceList data={placesTop} loading={isLoadingPlacesTop} />
              )}
              <LogoFooterWrap onPress={() => navigation.navigate(Screen.About)}>
                <LogoFooter source={conexaoArte} resizeMode="contain" />
              </LogoFooterWrap>
            </Animated.View>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: 0,
                  paddingHorizontal: 0,
                  paddingTop: 10,
                },
                animatedFoundStyle,
              ]}
            >
              <Button
                color="text"
                size="small"
                propsTouchable={{ onPress: () => clearSearchResult() }}
              >
                Limpar resultados da pesquisa
              </Button>
              <PlaceList data={placesFound} loading={isLoadingSearch} />
            </Animated.View>
          </Relative>
        </ScreenContent>
      </ScrollView>
    </ScreenProvider>
  );
};
