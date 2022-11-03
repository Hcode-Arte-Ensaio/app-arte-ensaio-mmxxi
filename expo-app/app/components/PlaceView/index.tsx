import styled from '@emotion/native';
import { Place } from '../../types/Place';
import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '../Canvas';
import { Colors, ColorsBackground } from '../../values/colors';
import { Dimensions, Linking } from 'react-native';
import { ButtonIcon } from '../ButtonIcon';
import { PhotosIcon } from '../../icons/PhotosIcon';
import { RatingStars } from '../RatingStars';
import { LinearGradient } from 'expo-linear-gradient';
import { FavoriteButton } from '../FavoriteButton';
import { Shadow } from 'react-native-shadow-2';
import { Button } from '../Button';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useRate } from '../../contexts/RateContext';
import { RouteIcon } from '../../icons/RouteIcon';
import { StarIcon } from '../../icons/StarIcon';
import { usePhotos } from '../../contexts/PhotosContext';
import { Post } from '../../types/Post';
import { useImageViewer } from '../../contexts/ImageViewerContext';
import { useApp } from '../../contexts/AppContext';
import { EditIcon } from '../../icons/EditIcon';
import { AdminUsers } from '../../values/adminUsers';
import { useAuth } from '../../contexts/AuthContext';
import { useEditPlace } from '../../contexts/EditPlaceContext';
import { useData } from '../../contexts/DataContext';
import { Photo } from '../../types/Photo';

const Wrap = styled.View`
  flex: 1;
`;

const Cover = styled.ImageBackground`
  background-color: ${Colors.Black};
  height: ${String((Dimensions.get('window').height / 20) * 11)}px;
  position: absolute;
  left: 0;
  right: 0;
  top: -1px;
  z-index: 1;
`;

const Header = styled.View`
  height: ${String((Dimensions.get('window').height / 20) * 8)}px;
  margin-top: 28px;
  justify-content: space-between;
`;

const Body = styled(Canvas)``;

const Content = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
`;

const Toolbar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-top: 7px;
  padding-right: 25px;
`;

const TitleRating = styled.View`
  padding: 25px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${Colors.White};
  width: ${String((Dimensions.get('window').width / 20) * 8)}px;
`;

const Rating = styled.View`
  flex-direction: row;
`;

const RatingValue = styled.Text`
  color: ${Colors.White};
  font-size: 16px;
  font-weight: bold;
  line-height: 25px;
  margin-left: 4px;
`;

const ButtonFavoriteWrap = styled.View`
  position: absolute;
  right: 25px;
  top: -32px;
`;

const TitleWrap = styled.TouchableOpacity`
  padding: 25px;
`;
const TitleText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${Colors.Black};
`;
const SubtitleText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${Colors.Gray};
`;

const PhotoList = styled.View`
  flex-direction: row;
  padding-left: 20px;
  padding-right: 20px;
`;

const PhotoItem = styled.TouchableOpacity`
  width: ${String((Dimensions.get('window').width - 80) / 4)}px;
  height: ${String((Dimensions.get('window').width - 80) / 4)}px;
  border-radius: 10px;
  background-color: #ccc;
  margin-left: 5px;
  margin-right: 5px;
`;

const PhotoItemImage = styled.Image`
  flex: 1;
  border-radius: 10px;
`;

const PhotoItemOverlay = styled.View`
  background-color: #00000088;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;
const PhotoItemText = styled.Text`
  color: ${Colors.White};
  font-size: 24px;
  font-weight: 500;
`;

const Description = styled.ScrollView`
  padding: 25px;
  padding-top: 20px;
`;
const DescriptionText = styled.Text`
  text-align: justify;
  font-size: 16px;
  font-weight: 300;
  line-height: 22px;
  margin-bottom: 75px;
`;

const FloatButton = styled.View`
  position: absolute;
  bottom: 25px;
  left: 25px;
  right: 25px;
`;

export type PlaceViewProps = {
  data: Place | null;
  onChange?: (place: Place) => void;
};

export const PlaceView = ({ data, onChange }: PlaceViewProps) => {
  const postData = {
    createdAt: '2022-10-27 16:30:00',
    id: 1,
    photo: {
      url: `https://conexao-arte.web.app/images/museu_do_ipiranga_square.jpg`,
    },
    user: {
      email: 'joao@hcode.com.br',
      name: 'Joao Rangel',
      photo: {
        url: 'https://lh3.googleusercontent.com/a/ALm5wu0YDxBadEeseByOOaLgr0CrcGCbAuOd3-1VEVfh8Bo=s83-c-mo',
      },
    },
  } as Post;

  const { user } = useAuth();
  const { showToast } = useApp();
  const { openRate } = useRate();
  const { openPhotos } = usePhotos();
  const { openImage } = useImageViewer();
  const { openPlace } = useEditPlace();
  const { putView, getPhotos } = useData();

  const [place, setPlace] = useState<Place | null>(data);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const bodyHeight = (Dimensions.get('window').height / 20) * 12 + -25;
  const scrollPercent = useSharedValue(0);

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

  const onScrollDescription = useCallback((e) => {
    const total = e.nativeEvent.layoutMeasurement.height;
    const compare = e.nativeEvent.contentOffset.y;
    const porcent = (compare * 100) / total;
    scrollPercent.value = porcent;
  }, []);

  const startGPSRoute = useCallback(async () => {
    const url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${encodeURIComponent(
      `${place.address.street}, ${place.address.number} ${place.address.district} - SP`
    )}`;
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      }
    } catch (e) {
      showToast(`Não é possível iniciar a rota para ${place.name}.`);
    }
  }, [place]);

  const getFontSize = (length: number) => {
    if (length > 40) {
      return 22;
    } else {
      return 32;
    }
  };

  const getWidth = (length: number) => {
    if (length > 40) {
      return (Dimensions.get('window').width / 20) * 14;
    } else if (length > 13) {
      return (Dimensions.get('window').width / 20) * 13;
    } else {
      return (Dimensions.get('window').width / 20) * 8;
    }
  };

  const linkToPlace = useCallback(async () => {
    const url =
      place.site ??
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place.lat + ',' + place.lng
      )}`;
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      }
    } catch (e) {
      showToast(`Não é possível abrir o mapa do local ${place.name}.`);
    }
  }, [place]);

  useEffect(() => {
    setPlace(data);
    if (data && data.id > 0) {
      putView(data.id).finally(() => {});
    }
  }, [data]);

  useEffect(() => {
    if (place && place.photos instanceof Array && place.photos.length > 0) {
      getPhotos(place.photos.filter((_item, index) => index < 3))
        .then(setPhotos)
        .finally(() => {});
    }
  }, [getPhotos, place]);

  if (place) {
    return (
      <Wrap>
        <Cover source={{ uri: place?.cover?.url }} resizeMode="cover" />
        <LinearGradient
          colors={['#00000000', '#00000088']}
          start={{ x: 0, y: 0.25 }}
          end={{ x: 0, y: 0.5 }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 500,
            zIndex: 2,
          }}
        />
        <Content>
          <Header>
            <Toolbar>
              {user && AdminUsers.includes(user.email) && (
                <ButtonIcon
                  icon={
                    <EditIcon
                      size={16}
                      fill={place?.theme === 'dark' ? '#fff' : '#222429'}
                    />
                  }
                  color={place?.theme === 'dark' ? 'blue' : 'white'}
                  circle={true}
                  touchableProps={{
                    onPress: () =>
                      openPlace(place, (newPlace) => {
                        setPlace(newPlace);
                        if (typeof onChange === 'function') {
                          onChange(newPlace);
                        }
                      }),
                  }}
                  style={{ marginRight: 20 }}
                />
              )}
              <ButtonIcon
                icon={
                  <PhotosIcon
                    size={16}
                    fill={place?.theme === 'dark' ? '#fff' : '#222429'}
                  />
                }
                color={place?.theme === 'dark' ? 'blue' : 'white'}
                circle={true}
                touchableProps={{
                  onPress: () =>
                    openPhotos(place, [postData, postData, postData]),
                }}
              />
            </Toolbar>
            <TitleRating>
              <Rating>
                <RatingStars value={place.rating} />
                <RatingValue>{place.rating}</RatingValue>
              </Rating>
              <Title
                style={{
                  fontSize: getFontSize(place?.title?.length ?? 0),
                  width: getWidth(place?.title?.length ?? 0),
                }}
              >
                {place.title}
              </Title>
            </TitleRating>
          </Header>
          <Animated.View
            style={[
              {
                position: 'absolute',
                bottom: 0,
                height: bodyHeight + 0,
              },
            ]}
          >
            <Body
              style={[
                {
                  borderTopLeftRadius: 25,
                  borderTopRightRadius: 25,
                },
              ]}
              colors={ColorsBackground}
            >
              <TitleWrap onPress={() => linkToPlace()}>
                <TitleText>
                  {place?.address?.street}
                  {place?.address?.number ? `, ${place?.address?.number}` : ''}
                </TitleText>
                <SubtitleText>{place?.address?.district}</SubtitleText>
              </TitleWrap>
              <PhotoList>
                {photos.map((photo) => (
                  <PhotoItem key={photo.url} onPress={() => openImage(photo)}>
                    <PhotoItemImage source={{ uri: photo?.url }} />
                  </PhotoItem>
                ))}
                <PhotoItem
                  onPress={() =>
                    openPhotos(place, [postData, postData, postData])
                  }
                >
                  <PhotoItemImage
                    source={{ uri: place?.square?.url ?? place?.cover?.url }}
                  />
                  <PhotoItemOverlay>
                    <PhotoItemText>+5</PhotoItemText>
                  </PhotoItemOverlay>
                </PhotoItem>
              </PhotoList>
              <Description
                showsVerticalScrollIndicator={false}
                onScroll={onScrollDescription}
              >
                <DescriptionText>{place.description}</DescriptionText>
              </Description>
              <Animated.View style={animatedButtonStyle}>
                <FloatButton>
                  <Button
                    split={[
                      {
                        text: 'Rotas',
                        icon: <RouteIcon size={24} fill="#fff" />,
                        onPress: () => startGPSRoute(),
                      },
                      {
                        text: 'Avaliar',
                        icon: <StarIcon size={24} fill="#fff" />,
                        onPress: () => openRate(place),
                      },
                    ]}
                  />
                </FloatButton>
              </Animated.View>
              <ButtonFavoriteWrap>
                <Shadow
                  offset={[0, 0]}
                  distance={15}
                  style={{ borderRadius: 32 }}
                  startColor={'#00000020'}
                >
                  {user && <FavoriteButton size={64} placeId={place.id} />}
                </Shadow>
              </ButtonFavoriteWrap>
            </Body>
          </Animated.View>
        </Content>
      </Wrap>
    );
  } else {
    return <Wrap></Wrap>;
  }
};
