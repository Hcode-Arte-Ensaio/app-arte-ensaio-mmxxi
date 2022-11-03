import styled from '@emotion/native';
import { ViewStyle, StyleProp } from 'react-native';
import { useImageViewer } from '../../contexts/ImageViewerContext';
import { DeleteIcon } from '../../icons/DeleteIcon';
import { EyeIcon } from '../../icons/EyeIcon';
import { PlaceIcon } from '../../icons/PlaceIcon';
import { Post } from '../../types/Post';
import { User } from '../../types/User';
import { Colors } from '../../values/colors';
import { Avatar } from '../Avatar';
import { ButtonIcon } from '../ButtonIcon';

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

export type UserPhotoItemProps = {
  style?: StyleProp<ViewStyle>;
};

export const UserPhotoItem = ({ style }: UserPhotoItemProps) => {
  const { openImage } = useImageViewer();
  const user = {
    name: 'Joao Rangel',
    email: 'joao@hcode.com.br',
    photo: {
      url: 'https://lh3.googleusercontent.com/a/ALm5wu0YDxBadEeseByOOaLgr0CrcGCbAuOd3-1VEVfh8Bo=s83-c-mo',
    },
  } as User;
  const post = {
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
  return (
    <Wrap style={style}>
      <Header>
        <RowContainer>
          <ButtonIcon
            icon={<PlaceIcon size={24} fill={Colors.Gray} />}
            style={{ marginRight: 10 }}
          />
          <ButtonIcon icon={<DeleteIcon size={24} fill={Colors.Gray} />} />
        </RowContainer>
        <RowContainer>
          <Text style={{ marginRight: 10 }}>2 semanas atrás</Text>
          <EyeIcon size={20} />
          <Text style={{ marginLeft: 4 }}>123</Text>
        </RowContainer>
      </Header>
      <ImageWrap onPress={() => openImage(post.photo)}>
        <Image source={{ uri: post.photo.url }} />
      </ImageWrap>
    </Wrap>
  );
};
