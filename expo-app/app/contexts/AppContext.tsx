import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { ToastAndroid } from 'react-native';

export type AppContextType = {
  showToast: (message: string, duration?: number) => void;
  setStatusBarStyle: (style: StatusBarStyle) => void;
};

export const AppContext = createContext<AppContextType>({
  showToast: () => {},
  setStatusBarStyle: () => {},
});

export type AppProviderProps = {
  children: any;
};

export const AppProvider = ({ children }) => {
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>('light');

  const showToast = useCallback(
    (message: string, duration = ToastAndroid.SHORT) => {
      ToastAndroid.show(message, duration);
    },
    []
  );

  useEffect(() => setStatusBarStyle(statusBarStyle), [statusBarStyle]);

  return (
    <AppContext.Provider value={{ showToast, setStatusBarStyle }}>
      <StatusBar style={statusBarStyle} animated={true} />
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(`Context not found.`);
  }
  return context;
};
