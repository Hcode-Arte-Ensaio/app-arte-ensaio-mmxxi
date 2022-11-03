import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screens, Screen } from '../values/screens';
import { ScreenProvider } from '../contexts/ScreenContext';
import { ScreenContent } from '../components/ScreenContent';
import { ColorsBackground } from '../values/colors';
import { ScreenToolbar } from '../components/ScreenToolbar';
import { H1 } from '../components/H1';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useCallback, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { PaddingSides } from '../components/PaddingSides';

type ChangePasswordScreenProps = NativeStackScreenProps<
  typeof Screens,
  Screen.ChangePassword
>;

export const ChangePasswordScreen = ({
  navigation,
}: ChangePasswordScreenProps) => {
  const { showToast } = useApp();
  const { updatePassword, user } = useAuth();
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmitForm = useCallback(() => {
    if (newPassword !== confirmPassword) {
      return showToast('Confirme a nova senha corretamente.');
    }

    setIsLoadingForm(true);

    updatePassword(currentPassword, newPassword)
      .then(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch((error) => showToast(error.message))
      .finally(() => setIsLoadingForm(false));
  }, [currentPassword, newPassword, confirmPassword]);

  useEffect(() => {
    if (user === null) {
      navigation.navigate(Screen.Places);
    }
  }, [user]);

  return (
    <ScreenProvider>
      <ScreenContent colors={ColorsBackground}>
        <ScreenToolbar onPressBack={() => navigation.navigate(Screen.Places)} />
        <H1 blackText="Alterar" redText="Senha" />
        <PaddingSides>
          <Input
            label="Senha atual"
            textInputProps={{
              value: currentPassword,
              onChangeText: (value) => setCurrentPassword(value),
              secureTextEntry: true,
            }}
          />
          <Input
            label="Nova senha"
            textInputProps={{
              value: newPassword,
              onChangeText: (value) => setNewPassword(value),
              secureTextEntry: true,
            }}
          />
          <Input
            label="Confirme a senha"
            textInputProps={{
              value: confirmPassword,
              onChangeText: (value) => setConfirmPassword(value),
              secureTextEntry: true,
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
