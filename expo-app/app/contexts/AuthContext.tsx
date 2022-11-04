import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import styled from '@emotion/native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Canvas } from '../components/Canvas';
import { Colors, ColorsBackground } from '../values/colors';
import { ButtonIcon } from '../components/ButtonIcon';
import { BackIcon } from '../icons/BackIcon';
import { Shadow } from 'react-native-shadow-2';
import { Dimensions } from 'react-native';
import { User } from '../types/User';
import { OverlayView } from '../components/OverlayView';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  User as FbUser,
  updatePassword as updatePasswordFB,
  deleteUser,
} from 'firebase/auth';
import { useApp } from './AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Form = styled.View``;

const FormTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${Colors.White};
  padding-left: 15px;
  padding-bottom: 10px;
  text-align: center;
`;

const Panel = styled(Canvas)`
  border-radius: 20px;
  margin-bottom: 25px;
  padding: 25px;
`;

const TextPanel = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`;

const Text1 = styled.Text`
  color: ${Colors.Gray};
  margin-right: 5px;
  font-size: 13px;
`;

const Text2 = styled.Text`
  color: ${Colors.Red};
  margin-right: 5px;
  font-size: 13px;
  font-weight: bold;
`;

const ButtonBack = styled.View``;

export type AuthContextType = {
  user: User | null;
  open: boolean;
  logOut: () => void;
  setOpen: (value: boolean) => void;
  setFirebaseUser: (fbUser: FbUser, displayName?: string) => void;
  updatePhoto: (photoURL: string) => Promise<void>;
  updateName: (displayName: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  open: false,
  logOut: () => {},
  setOpen: () => {},
  setFirebaseUser: () => {},
  updatePhoto: () => new Promise(() => {}),
  updateName: () => new Promise(() => {}),
  updatePassword: () => new Promise(() => {}),
  deleteAccount: () => new Promise(() => {}),
});

export type FormType = 'login' | 'register' | 'forget';

export const AuthProvider = ({ children }) => {
  const auth = getAuth();
  const { showToast, setStatusBarStyle } = useApp();
  const startY = (Dimensions.get('window').height + 10) * -1;
  const startX = (Dimensions.get('window').width + 10) * -1;
  const [fbUser, setFbUser] = useState<FbUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [formActive, setFormActive] = useState<FormType>('login');
  const left = useSharedValue(startX);
  const bottom = useSharedValue(startY);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formLoginLoading, setLoginLoading] = useState(false);
  const [formRegisterLoading, setRegisterLoading] = useState(false);
  const [formForgetLoading, setForgetLoading] = useState(false);

  const SPRING_CONFIG = {
    damping: 80,
    stiffness: 500,
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: bottom.value * -1,
        },
      ],
    };
  });

  const animatedBackButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: left.value,
        },
      ],
    };
  });

  const deleteAccount = useCallback(
    (password: string) => {
      return new Promise<void>((resolve, reject) => {
        if (!password) {
          return reject(new TypeError('Preencha o campo senha atual.'));
        }
        if (user && fbUser) {
          signInWithEmailAndPassword(auth, user.email, password)
            .then(() => deleteUser(fbUser))
            .then(() => {
              setFbUser(null);
              setUser(null);
              showToast('Conta excluída com sucesso!');
              resolve();
            })
            .catch((error) => {
              switch (error.code) {
                case 'auth/wrong-password':
                  reject(new TypeError('Senha atual incorreta.'));
                  break;
                default:
                  reject(error);
              }
            });
        } else {
          reject(
            new TypeError(
              'Não é possível excluir a conta pois você não está autenticado.'
            )
          );
        }
      });
    },
    [user, fbUser]
  );

  const updatePassword = useCallback(
    (currentPassword: string, newPassword: string) => {
      return new Promise<void>((resolve, reject) => {
        if (!currentPassword) {
          return reject(new TypeError('Preencha o campo senha atual.'));
        }

        if (!newPassword) {
          return reject(new TypeError('Preencha o campo nova senha.'));
        }

        if (user && fbUser) {
          signInWithEmailAndPassword(auth, user.email, currentPassword)
            .then(() => updatePasswordFB(fbUser, newPassword))
            .then(() => {
              showToast('Senha atualizada com sucesso!');
              resolve();
            })
            .catch((error) => {
              switch (error.code) {
                case 'auth/wrong-password':
                  reject(new TypeError('Senha atual incorreta.'));
                  break;
                default:
                  reject(error);
              }
            });
        } else {
          reject(
            new TypeError(
              'Não é possível atualizar a senha pois você não está autenticado.'
            )
          );
        }
      });
    },
    [fbUser, auth, user]
  );

  const setFirebaseUser = useCallback(
    (fbUser: FbUser, displayName?: string) => {
      setFbUser(fbUser);
      setUser({
        id: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName ?? displayName ?? 'Sem nome',
        photo: {
          url:
            fbUser.photoURL ??
            'https://conexao-arte.web.app/images/nophoto.png',
        },
      });

      AsyncStorage.setItem('@auth', JSON.stringify(fbUser))
        .then(() => {})
        .catch((error) => showToast(error.message));
    },
    []
  );

  const updatePhoto = useCallback(
    (photoURL: string) => {
      return new Promise<void>((resolve, reject) => {
        if (user && fbUser) {
          updateProfile(fbUser, {
            photoURL,
            displayName: user.name,
          })
            .then(() => {
              setUser({ ...user, photo: { url: photoURL } });
              resolve();
            })
            .catch(reject);
        } else {
          reject(
            new TypeError(
              'Não é possível atualizar a foto pois você não está autenticado.'
            )
          );
        }
      });
    },
    [user, fbUser]
  );

  const updateName = useCallback(
    (displayName: string) => {
      return new Promise<void>((resolve, reject) => {
        if (user && fbUser) {
          updateProfile(fbUser, {
            displayName,
            photoURL: user?.photo?.url,
          })
            .then(() => {
              setUser({ ...user, name: displayName });
              resolve();
            })
            .catch(reject);
        } else {
          reject(
            new TypeError(
              'Não é possível atualizar o nome pois você não está autenticado.'
            )
          );
        }
      });
    },
    [user, fbUser]
  );

  const logOut = useCallback(() => {
    signOut(auth)
      .then(() => AsyncStorage.removeItem('@auth'))
      .then(() => {
        setFbUser(null);
        setUser(null);
      })
      .catch(() => showToast('Não foi possível fazer o logout.'));
  }, [auth]);

  const setFormReset = useCallback(() => {
    setFormName('');
    setFormEmail('');
    setFormPassword('');
  }, []);

  const onSubmitLogin = useCallback(() => {
    if (!formEmail) {
      return showToast('Preencha o campo e-mail.');
    }
    if (!formPassword) {
      return showToast('Preencha o campo senha.');
    }

    setLoginLoading(true);

    signInWithEmailAndPassword(auth, formEmail, formPassword)
      .then((result) => {
        setFormReset();
        setFirebaseUser(result.user);
        setOpen(false);
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/wrong-password':
          case 'auth/user-not-found':
          case 'auth/invalid-email':
            showToast('E-mail e/ou senha inválidos.');
            break;
          default:
            showToast(error.message);
        }
      })
      .finally(() => setLoginLoading(false));
  }, [auth, formEmail, formPassword]);

  const onSubmitRegister = useCallback(() => {
    if (!formName) {
      return showToast('Preencha o campo nome.');
    }
    if (!formEmail) {
      return showToast('Preencha o campo e-mail.');
    }
    if (!formPassword) {
      return showToast('Preencha o campo senha.');
    }
    setRegisterLoading(true);
    createUserWithEmailAndPassword(auth, formEmail, formPassword)
      .then((result) => {
        setFormReset();
        setFirebaseUser(result.user, formName);
        setOpen(false);
        return updateProfile(result.user, {
          displayName: formName,
        });
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            showToast('Este endereço de e-mail já está cadastrado.');
            break;
          case 'auth/weak-password':
            showToast('A senha precisa ter pelo menos 6 caracteres.');
            break;
          default:
            showToast(error.message);
        }
      })
      .finally(() => setRegisterLoading(false));
  }, [auth, formEmail, formPassword, formName]);

  const onSubmitForget = useCallback(() => {
    if (!formEmail) {
      return showToast('Preencha o campo e-mail.');
    }
    setForgetLoading(true);
    sendPasswordResetEmail(auth, formEmail)
      .then(() => {
        setFormReset();
        showToast(
          'As instruções de recuperação foram enviadas para o seu e-mail.'
        );
      })
      .catch((error) => showToast(error.message))
      .finally(() => setForgetLoading(false));
  }, [auth, formEmail]);

  useEffect(() => {
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      (authUser) => setFbUser(authUser),
      (error) => showToast(error.message)
    );
    return () => {
      unsubscribeAuthStateChanged();
    };
  }, [auth]);

  useEffect(() => {
    setStatusBarStyle(open ? 'light' : 'dark');
    bottom.value = withSpring(open ? 0 : startY, SPRING_CONFIG);
    left.value = withSpring(open ? 0 : startX, SPRING_CONFIG);
  }, [open]);

  useEffect(() => {
    AsyncStorage.getItem('@auth')
      .then((data) => {
        try {
          const fbUser = JSON.parse(data);
          setFirebaseUser(fbUser);
        } catch (e) {}
      })
      .catch((error) => showToast(error.message));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        deleteAccount,
        open,
        setOpen,
        user,
        setFirebaseUser,
        logOut,
        updatePhoto,
        updateName,
        updatePassword,
      }}
    >
      {children}
      {open && <OverlayView onPress={() => setOpen(false)} />}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'flex-end',
            zIndex: 100,
            padding: 25,
          },
          animatedStyle,
        ]}
      >
        {formActive === 'login' && (
          <Form>
            <FormTitle>Login</FormTitle>
            <Panel colors={ColorsBackground}>
              <TextPanel onPress={() => setFormActive('register')}>
                <Text1>Ainda não tem uma conta?</Text1>
                <Text2>Crie uma conta</Text2>
              </TextPanel>
              <Input
                label="E-mail"
                textInputProps={{
                  keyboardType: 'email-address',
                  value: formEmail,
                  onChangeText: (value) => setFormEmail(value),
                }}
              />
              <Input
                label="Senha"
                textInputProps={{
                  secureTextEntry: true,
                  value: formPassword,
                  onChangeText: (value) => setFormPassword(value),
                }}
              />
              <TextPanel
                onPress={() => setFormActive('forget')}
                style={{ justifyContent: 'flex-start', marginTop: 10 }}
              >
                <Text1>Esqueceu a senha?</Text1>
                <Text2>Recuperar</Text2>
              </TextPanel>
            </Panel>
            <Button
              propsTouchable={{ onPress: () => onSubmitLogin() }}
              loading={formLoginLoading}
            >
              Entrar
            </Button>
          </Form>
        )}
        {formActive === 'register' && (
          <Form>
            <FormTitle>Cadastre-se</FormTitle>
            <Panel colors={ColorsBackground}>
              <TextPanel onPress={() => setFormActive('login')}>
                <Text1>Já tem uma conta?</Text1>
                <Text2>Fazer login</Text2>
              </TextPanel>
              <Input
                label="Nome"
                textInputProps={{
                  value: formName,
                  onChangeText: (value) => setFormName(value),
                }}
              />
              <Input
                label="E-mail"
                textInputProps={{
                  keyboardType: 'email-address',
                  value: formEmail,
                  onChangeText: (value) => setFormEmail(value),
                }}
              />
              <Input
                label="Senha"
                textInputProps={{
                  secureTextEntry: true,
                  value: formPassword,
                  onChangeText: (value) => setFormPassword(value),
                }}
              />
            </Panel>
            <Button
              propsTouchable={{ onPress: () => onSubmitRegister() }}
              loading={formRegisterLoading}
            >
              Cadastrar
            </Button>
          </Form>
        )}
        {formActive === 'forget' && (
          <Form>
            <FormTitle>Recuperação</FormTitle>
            <Panel colors={ColorsBackground}>
              <TextPanel onPress={() => setFormActive('login')}>
                <Text1>Se lembra da senha?</Text1>
                <Text2>Fazer login</Text2>
              </TextPanel>
              <Input
                label="E-mail"
                textInputProps={{
                  keyboardType: 'email-address',
                  value: formEmail,
                  onChangeText: (value) => setFormEmail(value),
                }}
              />
            </Panel>
            <Button
              propsTouchable={{ onPress: () => onSubmitForget() }}
              loading={formForgetLoading}
            >
              Recuperar
            </Button>
          </Form>
        )}
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
            startColor={'#FFFFFF40'}
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
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(`AuthContext not found.`);
  }
  return context;
};
