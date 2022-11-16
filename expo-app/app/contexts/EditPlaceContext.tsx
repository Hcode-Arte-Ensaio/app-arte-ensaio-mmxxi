import styled from '@emotion/native';
import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { Dimensions, BackHandler } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { Button } from '../components/Button';
import { ButtonIcon } from '../components/ButtonIcon';
import { Canvas } from '../components/Canvas';
import { Input } from '../components/Input';
import { BackIcon } from '../icons/BackIcon';
import { Place } from '../types/Place';
import { ColorsBackground } from '../values/colors';
import { Picker } from '@react-native-picker/picker';
import { Category } from '../types/Category';
import { useData } from './DataContext';
import { useApp } from './AppContext';
import { Select } from '../components/Select';

const Text = styled.Text``;
const ButtonBack = styled.View``;
const ScrollView = styled.ScrollView`
  padding: 0 25px;
`;

const Form = styled(Canvas)`
  padding-top: 75px;
`;

export type EditPlaceContextType = {
  openPlace: (value: Place, onChange?: (place: Place) => void) => void;
};

export const EditPlaceContext = createContext<EditPlaceContextType>({
  openPlace: () => {},
});

export type EditPlaceProviderProps = {
  children: any;
};

export const EditPlaceProvider = ({ children }) => {
  const { showToast } = useApp();
  const { getCategories, putPlace } = useData();
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [onCallbacks, setOnCallbacks] = useState<any[]>([]);

  const startY = Dimensions.get('window').height + 10;
  const buttonStartX = (Dimensions.get('window').width + 10) * -1;

  const containerOpacity = useSharedValue(0);
  const topY = useSharedValue(startY);
  const buttonLeft = useSharedValue(buttonStartX);

  const SPRING_CONFIG = {
    damping: 80,
    stiffness: 500,
  };

  const animatedContainerViewStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value,
      transform: [
        {
          translateY: topY.value,
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

  const submitForm = useCallback(() => {
    setIsLoadingForm(true);
    putPlace(place)
      .then(() => {
        if (onCallbacks.length > 0 && typeof onCallbacks[0] === 'function') {
          onCallbacks[0](place);
        }
        showToast('Local salvo com sucesso!');
        setOpen(false);
      })
      .catch((error) => showToast(error.message))
      .finally(() => setIsLoadingForm(false));
  }, [place]);

  useEffect(() => {
    setOpen(place !== null);
  }, [place]);

  useEffect(() => {
    containerOpacity.value = withSpring(open ? 1 : 0, SPRING_CONFIG);
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
    setIsLoadingCategories(true);
    getCategories()
      .then(setCategories)
      .catch(() => showToast('Não foi possível obter a lista de categorias.'))
      .finally(() => setIsLoadingCategories(false));
  }, [getCategories]);

  return (
    <EditPlaceContext.Provider value={{ openPlace }}>
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
          },
          animatedContainerViewStyle,
        ]}
      >
        <Form colors={ColorsBackground}>
          {place && (
            <ScrollView>
              <Input
                label="Nome curto"
                textInputProps={{
                  value: place.name,
                  onChangeText: (value) => setPlace({ ...place, name: value }),
                }}
              />
              <Input
                label="Título"
                textInputProps={{
                  value: place.title,
                  onChangeText: (value) => setPlace({ ...place, title: value }),
                }}
              />
              <Input
                label="Descrição"
                height={100}
                textInputProps={{
                  value: place.description,
                  onChangeText: (value) =>
                    setPlace({ ...place, description: value }),
                  multiline: true,
                }}
              />
              <Input
                label="Logradouro"
                textInputProps={{
                  value: place?.address?.street,
                  onChangeText: (value) =>
                    setPlace({
                      ...place,
                      address: { ...place.address, street: value },
                    }),
                }}
              />
              <Input
                label="Número do endereço"
                textInputProps={{
                  value: place?.address?.number,
                  onChangeText: (value) =>
                    setPlace({
                      ...place,
                      address: { ...place.address, number: value },
                    }),
                }}
              />
              <Input
                label="Bairro"
                textInputProps={{
                  value: place?.address?.district,
                  onChangeText: (value) =>
                    setPlace({
                      ...place,
                      address: { ...place.address, district: value },
                    }),
                }}
              />
              <Input
                label="Latitude"
                textInputProps={{
                  value: String(place.lat),
                  onChangeText: (value) =>
                    setPlace({ ...place, lat: Number(value) }),
                }}
              />
              <Input
                label="Longitude"
                textInputProps={{
                  value: String(place.lng),
                  onChangeText: (value) =>
                    setPlace({ ...place, lng: Number(value) }),
                }}
              />
              <Input
                label="Site"
                textInputProps={{
                  value: place.site,
                  onChangeText: (value) => setPlace({ ...place, site: value }),
                }}
              />
              <Input
                label="Nota da avaliação (0.0 a 5.0)"
                textInputProps={{
                  value: String(place.rating ? place.rating : 5),
                  onChangeText: (value) =>
                    setPlace({
                      ...place,
                      rating: Number(Number(value).toPrecision(1)),
                    }),
                }}
              />
              <Input
                label="URL da Capa"
                textInputProps={{
                  value:
                    place?.cover?.url ?? `https://conexao-arte.web.app/images/`,
                  onChangeText: (value) =>
                    setPlace({ ...place, cover: { url: value } }),
                }}
              />
              <Input
                label="URL da Capa Quadrada"
                textInputProps={{
                  value:
                    place?.square?.url ??
                    `https://conexao-arte.web.app/images/`,
                  onChangeText: (value) =>
                    setPlace({ ...place, square: { url: value } }),
                }}
              />
              {isLoadingCategories && <Text>Carregando as categorias...</Text>}
              <Select
                label="Categoria"
                pickerProps={{
                  selectedValue: place?.category?.id,
                  onValueChange: (itemValue) => {
                    setPlace({
                      ...place,
                      category: categories.find(
                        (c) => c.id === Number(itemValue)
                      ),
                    });
                  },
                }}
              >
                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.singular}
                    value={category.id}
                  />
                ))}
              </Select>
              <Select
                label="Tema"
                pickerProps={{
                  selectedValue: place?.theme,
                  onValueChange: (itemValue) => {
                    setPlace({
                      ...place,
                      theme: itemValue as any,
                    });
                  },
                }}
              >
                <Picker.Item label="Light" value="light" />
                <Picker.Item label="Dark" value="dark" />
              </Select>

              <Button
                color="blue"
                style={{ marginTop: 25, marginBottom: 25 }}
                loading={isLoadingForm}
                propsTouchable={{ onPress: () => submitForm() }}
              >
                Salvar
              </Button>
            </ScrollView>
          )}
        </Form>
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
    </EditPlaceContext.Provider>
  );
};

export const useEditPlace = () => {
  const context = useContext(EditPlaceContext);
  if (!context) {
    throw new Error(`Context EditPlace not found.`);
  }
  return context;
};
