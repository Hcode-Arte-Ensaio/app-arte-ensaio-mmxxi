import styled from '@emotion/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screens, Screen } from '../values/screens';
import { ScreenProvider } from '../contexts/ScreenContext';
import { ScreenContent } from '../components/ScreenContent';
import { Colors, ColorsBackground } from '../values/colors';
import { ScreenToolbar } from '../components/ScreenToolbar';
import { H1 } from '../components/H1';
import { Input } from '../components/Input';
import { useCallback, useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ToastAndroid } from 'react-native';
import { PaddingSides } from '../components/PaddingSides';

const Text = styled.Text`
  font-size: 16px;
  line-height: 24px;
  font-weight: 300;
  text-align: justify;
  color: ${Colors.Black};
`;

const ItalicBold = styled.Text`
  font-style: italic;
  font-weight: bold;
`;

type DeleteAccountScreenProps = NativeStackScreenProps<
  typeof Screens,
  Screen.DeleteAccount
>;

export const DeleteAccountScreen = ({
  navigation,
}: DeleteAccountScreenProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { showToast } = useApp();
  const { deleteAccount, user } = useAuth();
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const onSubmitForm = useCallback(() => {
    if (confirm !== 'excluir permanentemente') {
      return showToast(
        'Leia as instruções atentamente antes de confirmar a exclusão da conta.',
        ToastAndroid.LONG
      );
    }

    setIsLoadingForm(true);

    deleteAccount(currentPassword)
      .then(() => {
        setCurrentPassword('');
        navigation.navigate(Screen.Places);
      })
      .catch((error) => showToast(error.message))
      .finally(() => setIsLoadingForm(false));
  }, [currentPassword, confirm]);

  useEffect(() => {
    if (user === null) {
      navigation.navigate(Screen.Places);
    }
  }, [user]);

  return (
    <ScreenProvider>
      <ScreenContent colors={ColorsBackground}>
        <ScreenToolbar onPressBack={() => navigation.navigate(Screen.Places)} />
        <H1 blackText="Excluir" redText="Conta" />
        <PaddingSides>
          <Text>
            Se desejar realmente excluir sua conta permanentemente e todos os
            dados relacionados com ela informe sua senha no campo abaixo e
            execreva <ItalicBold>excluir permanentemente</ItalicBold> no campo
            confirmação.
          </Text>
          <Input
            label="Senha atual"
            textInputProps={{
              value: currentPassword,
              onChangeText: (value) => setCurrentPassword(value),
              secureTextEntry: true,
            }}
          />
          <Input
            label="Confirmação"
            textInputProps={{
              value: confirm,
              onChangeText: (value) => setConfirm(value),
            }}
          />
          <Button
            style={{ width: '100%', marginTop: 20 }}
            loading={isLoadingForm}
            propsTouchable={{ onPress: () => onSubmitForm() }}
          >
            Excluir
          </Button>
        </PaddingSides>
      </ScreenContent>
    </ScreenProvider>
  );
};
