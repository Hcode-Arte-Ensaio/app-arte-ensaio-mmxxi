import styled from '@emotion/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shadow } from 'react-native-shadow-2';
import { Colors } from '../../values/colors';
import { StyleProp, ViewStyle } from 'react-native';
import { usePlace } from '../../contexts/PlaceContext';
import { Place } from '../../types/Place';
import { RatingStars } from '../RatingStars';
import { FavoriteButton } from '../FavoriteButton';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Wrap = styled.View`
  width: 300px;
  height: 340px;
  border-radius: 18px;
  position: relative;
`;

const Button = styled.TouchableOpacity`
  width: 300px;
  height: 340px;
  border-radius: 18px;
  position: relative;
`;

const Photo = styled.Image`
  width: 100%
  height: 100%;
  flex: 1;
  border-radius: 18px;
`;

const Title = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 100px;
  padding: 20px;
`;

const TitleText = styled.Text`
  color: ${Colors.White};
  font-size: 26px;
  font-weight: 500;
  line-height: 35px;
`;

const Rating = styled.View`
  flex-direction: row;
`;

const RatingValue = styled.Text`
  color: ${Colors.White};
  font-size: 16px;
  font-weight: bold;
  line-height: 25px;
  margin-left: 4px;
`;

export type PlaceThumbProps = {
  style?: StyleProp<ViewStyle>;
  data: Place;
};

export const PlaceThumb = ({ style, data }: PlaceThumbProps) => {
  const { user } = useAuth();
  const [place, setPlace] = useState(data);
  const { openPlace } = usePlace();
  useEffect(() => setPlace(data), [data]);
  return (
    <Wrap style={style}>
      <Shadow
        offset={[0, 4]}
        distance={16}
        style={{ borderRadius: 18 }}
        startColor={'#00000020'}
      >
        <Button onPress={() => openPlace(place, (value) => setPlace(value))}>
          {(place?.square?.url || place?.cover?.url) && (
            <Photo
              source={{
                uri: place?.square?.url ?? place?.cover?.url,
              }}
            />
          )}
          <LinearGradient
            colors={['#00000000', '#000000CC']}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 0, y: 0.8 }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '75%',
              borderRadius: 18,
            }}
          />
          {user && (
            <FavoriteButton
              style={{
                position: 'absolute',
                right: 20,
                top: 20,
              }}
              placeId={place.id}
            />
          )}
          <Title>
            <Rating>
              <RatingStars value={place.rating} />
              <RatingValue>{place.rating}</RatingValue>
            </Rating>
            <TitleText>{place.title}</TitleText>
          </Title>
        </Button>
      </Shadow>
    </Wrap>
  );
};
