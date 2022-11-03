import styled from '@emotion/native';
import { createContext, ReactNode, useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Canvas } from '../components/Canvas';
import { ColorsBackground } from '../values/colors';
import { RefreshControl } from 'react-native';

const ScrollView = styled.ScrollView`
  flex: 1;
`;

export type ScreenContextType = {};

export const ScreenContext = createContext({});

export type ScreenProviderProps = {
  children: ReactNode;
  onRefresh?: (finish: () => void) => void;
};

export const ScreenProvider = ({
  children,
  onRefresh,
}: ScreenProviderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  return (
    <ScreenContext.Provider value={{}}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                if (typeof onRefresh === 'function') {
                  setIsRefreshing(true);
                  onRefresh(() => setIsRefreshing(false));
                }
              }}
            />
          }
        >
          <Canvas colors={ColorsBackground}>{children}</Canvas>
        </ScrollView>
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
