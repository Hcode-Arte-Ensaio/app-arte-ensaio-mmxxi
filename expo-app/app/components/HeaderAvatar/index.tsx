import styled from '@emotion/native';
import { MenuIcon } from '../../icons/MenuIcon';
import { Avatar } from '../Avatar';
import { ButtonIcon } from '../ButtonIcon';
import { Colors, ColorsBackground } from '../../values/colors';
import { useDrawerNavigation } from '../../hooks/useDrawerNavigation';
import { useAuth } from '../../contexts/AuthContext';
import { UserNoPhotoIcon } from '../../icons/UserNoPhotoIcon';
import { Shadow } from 'react-native-shadow-2';
import { LoginIcon } from '../../icons/LoginIcon';
import { Screen } from '../../values/screens';

const Wrap = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 10px;
`;

const HeaderTitle = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  padding-left: 20px;
`;

const HeaderTitleText = styled.Text<{ size: number }>`
  font-size: ${(props) => (props.size > 0 ? String(props.size) : '22')}px;
  font-weight: 500;
  color: ${Colors.Black};
`;

const HeaderTitleTextBlue = styled.Text`
  color: ${Colors.Blue};
  font-weight: bold;
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const AvatarNoPhoto = styled.TouchableOpacity``;

export type HeaderAvatarProps = {};

export const HeaderAvatar = ({}: HeaderAvatarProps) => {
  const navigation = useDrawerNavigation();
  const { setOpen, open, user } = useAuth();
  return (
    <Wrap>
      {user && (
        <Avatar
          onPress={() => navigation.navigate(Screen.Profile)}
          imageProps={{
            source: {
              uri: user.photo.url,
            },
          }}
        />
      )}
      {!user && (
        <AvatarNoPhoto onPress={() => setOpen(true)}>
          <Shadow
            offset={[0, 4]}
            distance={4}
            style={{ borderRadius: 48 / 2 }}
            startColor={'#00000015'}
          >
            <UserNoPhotoIcon size={48} />
          </Shadow>
        </AvatarNoPhoto>
      )}
      {user && (
        <Button onPress={() => navigation.navigate(Screen.Profile)}>
          <HeaderTitle>
            {user && (
              <HeaderTitleText size={22}>Oi, {user.name}!</HeaderTitleText>
            )}
          </HeaderTitle>
        </Button>
      )}
      {!user && (
        <Button onPress={() => setOpen(true)}>
          <HeaderTitle>
            <HeaderTitleText
              size={22}
              style={{ fontSize: 14, fontWeight: '500' }}
            >
              <HeaderTitleTextBlue>Acessar</HeaderTitleTextBlue> ou{' '}
              <HeaderTitleTextBlue>Criar</HeaderTitleTextBlue> uma conta.
            </HeaderTitleText>
          </HeaderTitle>
        </Button>
      )}
      {user && (
        <ButtonIcon
          icon={<MenuIcon size={32} />}
          touchableProps={{ onPress: () => navigation.toggleDrawer() }}
        />
      )}
      {!user && (
        <ButtonIcon
          icon={<LoginIcon size={32} />}
          touchableProps={{ onPress: () => setOpen(true) }}
        />
      )}
    </Wrap>
  );
};
