import styled from '@emotion/native';
import { ViewStyle, StyleProp, Alert, ActivityIndicator } from 'react-native';
import { useImageViewer } from '../../contexts/ImageViewerContext';
import { usePlace } from '../../contexts/PlaceContext';
import { DeleteIcon } from '../../icons/DeleteIcon';
import { EyeIcon } from '../../icons/EyeIcon';
import { PlaceIcon } from '../../icons/PlaceIcon';
import { Photo } from '../../types/Photo';
import { Place } from '../../types/Place';
import { Colors } from '../../values/colors';
import { ButtonIcon } from '../ButtonIcon';
import { useState, useEffect, useCallback } from 'react';
import { useData } from '../../contexts/DataContext';
import { where } from 'firebase/firestore';
import { formatDistance } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';
import { Button } from '../Button';
import { useApp } from '../../contexts/AppContext';

const Wrap = styled.View`
  margin-bottom: 15px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  padding-bottom: 15px;
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Text = styled.Text`
  font-size: 14px;
  color: ${Colors.Gray};
`;

const ImageWrap = styled.TouchableOpacity``;

const Image = styled.Image`
  width: 100%;
  height: 290px;
`;

export type PhotoItemProps = {
  style?: StyleProp<ViewStyle>;
  data: Photo;
};

export const PhotoItem = ({ style, data }: PhotoItemProps) => {
  const { showToast } = useApp();
  const { openPlace } = usePlace();
  const { openImage } = useImageViewer();
  const { getPlaces, deletePhoto } = useData();

  const [photo, setPhoto] = useState<Photo>(data);
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => setPhoto(data), [data]);

  useEffect(() => {
    if (photo) {
      getPlaces({ where: where('id', 'in', [photo.placeId]) }).then(
        (places) => {
          if (places.length > 0) {
            setPlace(places[0]);
          }
        }
      );
    }
  }, [photo, getPlaces]);

  const deletePost = useCallback((value: Photo) => {
    Alert.alert('Atenção', 'Deseja realmente excluir esta foto?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        onPress: () => {
          deletePhoto(value.id)
            .then(() => {
              showToast('Foto excluída!');
            })
            .catch((error) => {
              showToast(error.message);
            });
        },
      },
    ]);
  }, []);

  return (
    <Wrap style={style}>
      <RowContainer></RowContainer>
      <Header>
        <RowContainer>
          {place === null && (
            <ActivityIndicator size={16} color={Colors.Gray} />
          )}
          {place !== null && (
            <Button
              propsTouchable={{ onPress: () => openPlace(place) }}
              startIcon={<PlaceIcon size={24} fill={Colors.Gray} />}
              color="text"
              size="small"
              style={{ marginLeft: -20 }}
            >
              {place.title}
            </Button>
          )}
        </RowContainer>
        <RowContainer>
          <Text style={{ marginRight: 10 }}>
            {formatDistance(
              new Date(photo.createdAt.seconds * 1000),
              new Date(),
              {
                addSuffix: true,
                locale,
              }
            )}
          </Text>
          <EyeIcon size={20} />
          <Text style={{ marginLeft: 4 }}>{photo.views}</Text>
          <ButtonIcon
            icon={<DeleteIcon size={24} fill={Colors.Gray} />}
            touchableProps={{ onPress: () => deletePost(photo) }}
            style={{ marginLeft: 10 }}
          />
        </RowContainer>
      </Header>
      <ImageWrap onPress={() => openImage(photo)}>
        <Image source={{ uri: photo.url }} />
      </ImageWrap>
    </Wrap>
  );
};
