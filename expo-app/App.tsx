import 'react-native-gesture-handler';
import 'expo-firestore-offline-persistence';
import './config/firebase';
import { NavigationContainer } from '@react-navigation/native';
import { Screens, Screen } from './app/values/screens';
import { PlacesScreen } from './app/screens/PlacesScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AppProvider } from './app/contexts/AppContext';
import { AuthProvider } from './app/contexts/AuthContext';
import { DrawerContent } from './app/components/DrawerContent';
import { PlaceProvider } from './app/contexts/PlaceContext';
import { ProfileScreen } from './app/screens/ProfileScreen';
import { ChangePasswordScreen } from './app/screens/ChangePasswordScreen';
import { FavoritesScreen } from './app/screens/FavoritesScreen';
import { PhotosScreen } from './app/screens/PhotosScreen';
import { DeleteAccountScreen } from './app/screens/DeleteAccountScreen';
import { AboutScreen } from './app/screens/AboutScreen';
import { RateProvider } from './app/contexts/RateContext';
import { PhotosProvider } from './app/contexts/PhotosContext';
import { ImageViewerProvider } from './app/contexts/ImageViewerContext';
import { StartProvider } from './app/contexts/StartContext';
import { DataProvider } from './app/contexts/DataContext';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { EditPlaceProvider } from './app/contexts/EditPlaceContext';

const Drawer = createDrawerNavigator<typeof Screens>();

export default function App() {
  const url = Linking.useURL();

  useEffect(() => console.log('App', { url }), [url]);

  return (
    <NavigationContainer>
      <AppProvider>
        <AuthProvider>
          <DataProvider>
            <StartProvider>
              <RateProvider>
                <ImageViewerProvider>
                  <PhotosProvider>
                    <EditPlaceProvider>
                      <PlaceProvider>
                        <Drawer.Navigator
                          screenOptions={{
                            drawerPosition: 'right',
                          }}
                          drawerContent={(props) => (
                            <DrawerContent {...props} />
                          )}
                          initialRouteName={Screen.Places}
                        >
                          <Drawer.Screen
                            name={Screen.Places}
                            component={PlacesScreen}
                            options={{
                              headerShown: false,
                            }}
                          />
                          <Drawer.Screen
                            name={Screen.Profile}
                            component={ProfileScreen}
                            options={{
                              headerShown: false,
                            }}
                          />
                          <Drawer.Screen
                            name={Screen.ChangePassword}
                            component={ChangePasswordScreen}
                            options={{
                              headerShown: false,
                            }}
                          />
                          <Drawer.Screen
                            name={Screen.Favorites}
                            component={FavoritesScreen}
                            options={{
                              headerShown: false,
                            }}
                          />
                          <Drawer.Screen
                            name={Screen.Photos}
                            component={PhotosScreen}
                            options={{
                              headerShown: false,
                            }}
                          />
                          <Drawer.Screen
                            name={Screen.DeleteAccount}
                            component={DeleteAccountScreen}
                            options={{
                              headerShown: false,
                            }}
                          />
                          <Drawer.Screen
                            name={Screen.About}
                            component={AboutScreen}
                            options={{
                              headerShown: false,
                            }}
                          />
                        </Drawer.Navigator>
                      </PlaceProvider>
                    </EditPlaceProvider>
                  </PhotosProvider>
                </ImageViewerProvider>
              </RateProvider>
            </StartProvider>
          </DataProvider>
        </AuthProvider>
      </AppProvider>
    </NavigationContainer>
  );
}
