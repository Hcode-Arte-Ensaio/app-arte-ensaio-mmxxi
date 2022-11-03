import styled from '@emotion/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screens, Screen } from '../values/screens';
import { ScreenProvider } from '../contexts/ScreenContext';
import { H1 } from '../components/H1';
import { Colors, ColorsBackground } from '../values/colors';
import { ScreenToolbar } from '../components/ScreenToolbar';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { CameraIcon } from '../icons/CameraIcon';
import { useCallback, useState, useEffect } from 'react';
import { GalleryIcon } from '../icons/GalleryIcon';
import { Input } from '../components/Input';
import { ScreenContent } from '../components/ScreenContent';
import { Divider } from '../components/Divider';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Platform } from 'react-native';
import { useData } from '../contexts/DataContext';
import { PaddingSides } from '../components/PaddingSides';

const AvatarWrap = styled.View`
  align-items: center;
  padding: 10px;
`;

const Text = styled.Text`
  font-size: 22px;
  font-weight: 500;
  color: ${Colors.Gray};
  margin: 25px 0;
  text-align: center;
`;

type ProfileScreenProps = NativeStackScreenProps<
  typeof Screens,
  Screen.Profile
>;

export const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { showToast } = useApp();
  const { updateName, user, updatePhoto } = useAuth();
  const { uploadFile } = useData();
  const [name, setName] = useState(user.name);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const handleImagePicked = useCallback((result) => {
    setIsLoadingPhoto(true);

    if (!result.cancelled) {
      uploadFile(result.uri)
        .then(updatePhoto)
        .then(() => showToast('Foto alterada com sucesso!'))
        .catch((error) => showToast(error.message))
        .finally(() => setIsLoadingPhoto(false));
    }
  }, []);

  const checkPermissions = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (Platform.OS !== 'web') {
        ImagePicker.requestMediaLibraryPermissionsAsync()
          .then(({ status }) => {
            if (status !== 'granted') {
              reject('Desculpe, precisamos de permissão para este recurso!');
            } else {
              resolve();
            }
          })
          .catch((error) => showToast(error.message));
      } else {
        reject('A câmera não está disponível na web.');
      }
    });
  }, []);

  const pickerCamera = useCallback(() => {
    checkPermissions()
      .then(() => {
        return ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
      })
      .then((result) => {
        if (!result.cancelled) {
          handleImagePicked(result);
        }
      })
      .catch((error) => showToast(error.message));
  }, []);

  const pickerGallery = useCallback(() => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
      .then((result) => {
        if (!result.cancelled) {
          handleImagePicked(result);
        }
      })
      .catch((error) => showToast(error.message))
      .finally();
  }, []);

  const onSubmitForm = useCallback(() => {
    if (!name) {
      return showToast('Preencha o campo e-mail.');
    }

    setIsLoadingForm(true);

    updateName(name)
      .then(() => showToast('Nome salvo com sucesso!'))
      .catch((error) => showToast(error.message))
      .finally(() => setIsLoadingForm(false));
  }, [name]);

  useEffect(() => {
    if (user === null) {
      navigation.navigate(Screen.Places);
    }
  }, [user]);

  return (
    <ScreenProvider>
      <ScreenContent colors={ColorsBackground}>
        <ScreenToolbar onPressBack={() => navigation.navigate(Screen.Places)} />
        <H1 blackText="Editar" redText="Dados e Foto" />
        <PaddingSides>
          <AvatarWrap>
            {!isLoadingPhoto && (
              <Avatar
                size={200}
                imageProps={{
                  source: {
                    uri: user.photo.url,
                  },
                }}
              />
            )}
            {isLoadingPhoto && <ActivityIndicator size={200} />}
          </AvatarWrap>
          <Text>Alterar foto do perfil</Text>
          <Button
            split={[
              {
                text: 'Câmera',
                icon: <CameraIcon size={24} fill="#fff" />,
                onPress: () => pickerCamera(),
              },
              {
                text: 'Galeria',
                icon: <GalleryIcon size={24} fill="#fff" />,
                onPress: () => pickerGallery(),
              },
            ]}
          />
          <Divider />
          <Input
            label="Nome completo"
            textInputProps={{
              value: name,
              onChangeText: (value) => setName(value),
            }}
          />
          <Button
            style={{ width: '100%', marginTop: 20 }}
            loading={isLoadingForm}
            propsTouchable={{ onPress: () => onSubmitForm() }}
          >
            Salvar
          </Button>
        </PaddingSides>
      </ScreenContent>
    </ScreenProvider>
  );
};
