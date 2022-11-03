import styled from '@emotion/native';
import { ViewStyle, StyleProp } from 'react-native';
import { useImageViewer } from '../../contexts/ImageViewerContext';
import { EyeIcon } from '../../icons/EyeIcon';
import { Photo } from '../../types/Photo';
import { Colors } from '../../values/colors';
import { Avatar } from '../Avatar';
import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

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

const UserName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${Colors.Black};
  margin-left: 10px;
`;

export type PlacePhotoItemProps = {
  style?: StyleProp<ViewStyle>;
  data: Photo;
};

export const PlacePhotoItem = ({ style, data }: PlacePhotoItemProps) => {
  const { putPhotoView } = useData();
  const { openImage } = useImageViewer();
  const [photo, setPhoto] = useState<Photo>(data);

  useEffect(() => setPhoto(data), [data]);
  useEffect(() => {
    if (photo) {
      putPhotoView(photo.id).finally(() => {});
    }
  }, [photo, putPhotoView]);

  return (
    <Wrap style={style}>
      <Header>
        <RowContainer>
          <RowContainer>
            <Avatar
              size={32}
              imageProps={{ source: { uri: photo.user.photo.url } }}
            />
            <UserName>{photo.user.name}</UserName>
          </RowContainer>
        </RowContainer>
        <RowContainer>
          <EyeIcon size={20} />
          <Text style={{ marginLeft: 4 }}>{photo.views}</Text>
        </RowContainer>
      </Header>
      <ImageWrap onPress={() => openImage(photo)}>
        <Image source={{ uri: photo.url }} />
      </ImageWrap>
    </Wrap>
  );
};
