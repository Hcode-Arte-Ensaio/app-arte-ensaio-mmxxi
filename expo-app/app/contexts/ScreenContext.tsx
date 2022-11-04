import styled from '@emotion/native';
import { createContext, ReactNode, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Canvas } from '../components/Canvas';
import { ColorsBackground } from '../values/colors';

export type ScreenContextType = {};

export const ScreenContext = createContext({});

export type ScreenProviderProps = {
  children: ReactNode;
};

export const ScreenProvider = ({ children }: ScreenProviderProps) => {
  return (
    <ScreenContext.Provider value={{}}>
      <SafeAreaView style={{ flex: 1 }}>
        <Canvas colors={ColorsBackground}>{children}</Canvas>
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
