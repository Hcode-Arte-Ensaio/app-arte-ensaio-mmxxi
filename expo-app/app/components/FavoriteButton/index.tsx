import styled from '@emotion/native';
import { FavoriteOnIcon } from '../../icons/FavoriteOnIcon';
import { ButtonIcon } from '../ButtonIcon';
import { useState, useEffect, useRef } from 'react';
import { StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import { FavoriteOffIcon } from '../../icons/FavoriteOffIcon';
import { Colors } from '../../values/colors';
import { useData } from '../../contexts/DataContext';
import { useApp } from '../../contexts/AppContext';

const Wrap = styled.View``;

export type FavoriteButtonProps = {
  size?: number;
  placeId: number;
  style?: StyleProp<ViewStyle>;
  onChange?: (value: boolean) => void;
  loading?: boolean;
};

export const FavoriteButton = ({
  size = 44,
  placeId,
  style,
  onChange,
  loading = false,
}: FavoriteButtonProps) => {
  const { showToast } = useApp();
  const { getFavorites, addFavorites, removeFavorites } = useData();
  const isFirstRun = useRef(true);
  const [id, setId] = useState(placeId);
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => setIsLoading(loading), [loading]);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (typeof onChange === 'function') {
      onChange(active);
    }
    if (!isLoading) {
      setIsLoading(true);
      if (active) {
        addFavorites([id])
          .then(() => {
            showToast('Local adicionado aos favoritos.');
          })
          .catch(() => setActive(false))
          .finally(() => setIsLoading(false));
      } else {
        removeFavorites([id])
          .then(() => {
            showToast('Local removido dos favoritos.');
          })
          .catch(() => setActive(true))
          .finally(() => setIsLoading(false));
      }
    }
  }, [active]);

  useEffect(() => {
    setIsLoading(true);
    setActive(false);
    getFavorites()
      .then((favorites) => {
        setActive(favorites.includes(id));
      })
      .catch(() => showToast('Não foi possível carregar os favoritos.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => setId(placeId), [placeId]);

  return (
    <Wrap style={style}>
      <ButtonIcon
        circle={true}
        color="white"
        size={size}
        touchableProps={{
          onPress: () => setActive(!active),
        }}
        icon={
          isLoading ? (
            <ActivityIndicator size={24} color={Colors.Blue} />
          ) : active ? (
            <FavoriteOnIcon size={24} />
          ) : (
            <FavoriteOffIcon size={24} />
          )
        }
      />
    </Wrap>
  );
};
