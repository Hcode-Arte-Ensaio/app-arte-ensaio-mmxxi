import styled from '@emotion/native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { LogoutIcon } from '../../icons/LogoutIcon';
import { UserIcon } from '../../icons/UserIcon';
import { Colors, ColorsBackground } from '../../values/colors';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Canvas } from '../Canvas';
import { PixelRatio } from 'react-native';
import { PasswordIcon } from '../../icons/PasswordIcon';
import { FavoriteIcon } from '../../icons/FavoriteIcon';
import { PhotosIcon } from '../../icons/PhotosIcon';
import { AlertIcon } from '../../icons/AlertIcon';
import { ButtonIcon } from '../ButtonIcon';
import { CloseIcon } from '../../icons/CloseIcon';
import { Screen } from '../../values/screens';
import { InfoIcon } from '../../icons/InfoIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';

const Wrap = styled(Canvas)`
  flex: 1;
  position: relative;
`;

const Header = styled.View`
  background-color: ${Colors.Blue};
  padding: ${String(PixelRatio.getPixelSizeForLayoutSize(8))}px;
`;

const HeaderTitle = styled.Text`
  color: ${Colors.White};
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const HeaderStats = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 0;
`;

const HeaderStat = styled.View`
  flex: 1;
  justify-content: center;
`;

const NumberStat = styled.Text`
  color: ${Colors.White};
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
`;

const SubtitleStat = styled.Text`
  color: ${Colors.White};
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  text-transform: uppercase;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-top: 10px;
`;

const AvatarWrap = styled.View`
  position: absolute;
  top: 140px;
  left: 25px;
  z-index: 1;
`;

const UserDetails = styled.TouchableOpacity`
  align-items: flex-end;
  padding: 10px;
`;

const UserName = styled.Text`
  color: ${Colors.Black};
  font-size: 16px;
  font-weight: 500;
`;
const UserEmail = styled.Text`
  color: ${Colors.Gray};
  font-size: 12px;
`;

const DrawerList = styled.View`
  padding: 25px;
  padding-top: 40px;
`;
const DrawerItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const DrawerItemText = styled.Text`
  color: ${Colors.Gray};
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  flex: 1;
  margin-left: 10px;
`;
const DrawerDivider = styled.View`
  width: 100%;
  height: ${String(PixelRatio.getPixelSizeForLayoutSize(0.5))}px;
  background-color: #d1d6e0;
  margin: 20px 0;
`;

const ButtonCloseWrap = styled.View`
  position: absolute;
  right: 10px;
  top: 17px;
`;

export type DrawerContentProps = {} & DrawerContentComponentProps;

export const DrawerContent = (props: DrawerContentProps) => {
  const { user, logOut } = useAuth();
  const { userData } = useData();
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    if (user === null && typeof props.navigation.closeDrawer === 'function') {
      props.navigation.closeDrawer();
    }
  }, [user, props]);

  if (!user) {
    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <Wrap colors={ColorsBackground} />
      </DrawerContentScrollView>
    );
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <Wrap colors={ColorsBackground}>
        <Header>
          <HeaderTitle>Suas contribuições</HeaderTitle>
          <HeaderStats>
            <HeaderStat>
              <NumberStat>{userData?.photos?.length ?? 0}</NumberStat>
              <SubtitleStat>Fotos</SubtitleStat>
            </HeaderStat>
            <HeaderStat>
              <NumberStat>{userData?.rates?.length ?? 0}</NumberStat>
              <SubtitleStat>Avaliações</SubtitleStat>
            </HeaderStat>
            <HeaderStat>
              <NumberStat>{userData?.favorites?.length ?? 0}</NumberStat>
              <SubtitleStat>Favoritos</SubtitleStat>
            </HeaderStat>
          </HeaderStats>
          <HeaderContent>
            <Button
              startIcon={<LogoutIcon size={12} />}
              color="dark"
              radius={10}
              size="small"
              loading={logoutLoading}
              propsTouchable={{
                onPress: () => {
                  setLogoutLoading(true);
                  logOut();
                },
              }}
            >
              Sair
            </Button>
          </HeaderContent>
        </Header>
        <AvatarWrap>
          {user && (
            <Avatar
              onPress={() => props.navigation.navigate(Screen.Profile)}
              size={100}
              imageProps={{
                source: {
                  uri: user?.photo?.url,
                },
              }}
            />
          )}
        </AvatarWrap>
        {user && (
          <UserDetails
            onPress={() => props.navigation.navigate(Screen.Profile)}
          >
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </UserDetails>
        )}
        <DrawerList>
          <DrawerItem onPress={() => props.navigation.navigate(Screen.Profile)}>
            <UserIcon />
            <DrawerItemText>Editar dados pessoais</DrawerItemText>
          </DrawerItem>
          <DrawerDivider />
          <DrawerItem
            onPress={() => props.navigation.navigate(Screen.ChangePassword)}
          >
            <PasswordIcon />
            <DrawerItemText>Alterar senha</DrawerItemText>
          </DrawerItem>
          <DrawerDivider />
          <DrawerItem
            onPress={() => props.navigation.navigate(Screen.Favorites)}
          >
            <FavoriteIcon />
            <DrawerItemText>MEUS FAVORITOS</DrawerItemText>
          </DrawerItem>
          <DrawerDivider />
          <DrawerItem onPress={() => props.navigation.navigate(Screen.Photos)}>
            <PhotosIcon />
            <DrawerItemText>MINHAS FOTOS</DrawerItemText>
          </DrawerItem>
          <DrawerDivider />
          <DrawerItem
            onPress={() => props.navigation.navigate(Screen.DeleteAccount)}
          >
            <AlertIcon />
            <DrawerItemText>Excluir Conta</DrawerItemText>
          </DrawerItem>
          <DrawerDivider />
          <DrawerItem onPress={() => props.navigation.navigate(Screen.About)}>
            <InfoIcon />
            <DrawerItemText>Sobre o App</DrawerItemText>
          </DrawerItem>
        </DrawerList>
        <ButtonCloseWrap>
          <ButtonIcon
            icon={<CloseIcon fill="#fff" />}
            color="dark"
            circle={true}
            touchableProps={{
              onPress: () => {
                props.navigation.closeDrawer();
              },
            }}
          />
        </ButtonCloseWrap>
      </Wrap>
    </DrawerContentScrollView>
  );
};
