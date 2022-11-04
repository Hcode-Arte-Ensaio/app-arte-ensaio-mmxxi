import styled from '@emotion/native';
import { createContext, ReactNode, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Canvas } from '../components/Canvas';
import { ColorsBackground } from '../values/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type ScreenContextType = {};

export const ScreenContext = createContext({});

export type ScreenProviderProps = {
  children: ReactNode;
  keyboard?: boolean;
};

export const ScreenProvider = ({
  children,
  keyboard = false,
}: ScreenProviderProps) => {
  return (
    <ScreenContext.Provider value={{}}>
      <SafeAreaView style={{ flex: 1 }}>
        {keyboard && (
          <KeyboardAwareScrollView>
            <Canvas colors={ColorsBackground}>{children}</Canvas>
          </KeyboardAwareScrollView>
        )}
        {!keyboard && <Canvas colors={ColorsBackground}>{children}</Canvas>}
      </SafeAreaView>
    </ScreenContext.Provider>
  );
};

export const useScreen = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error(`Context not found.`);
  }
  return context;
};
