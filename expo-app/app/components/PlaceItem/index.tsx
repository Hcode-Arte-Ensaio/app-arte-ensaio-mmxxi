import styled from '@emotion/native';
import { ViewStyle, StyleProp, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { usePlace } from '../../contexts/PlaceContext';
import { Place } from '../../types/Place';
import { Colors } from '../../values/colors';
import { useState, useEffect } from 'react';

const Wrap = styled.TouchableOpacity`
  padding: 10px 0px;
`;

const Body = styled.View`
  background-color: ${Colors.White};
  border-radius: 15px;
  height: 75px;
  width: ${String(parseInt(String(Dimensions.get('window').width - 50)))}px;
  flex-direction: row;
  padding: 10px;
`;

const Photo = styled.Image`
  width: 55px;
  height: 55px;
  border-radius: 10px;
  margin-right: 15px;
`;

const YLayout = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${Colors.Black};
`;

const Description = styled.Text`
  font-size: 12px;
  color: ${Colors.Gray};
`;

export type PlaceItemProps = {
  style?: StyleProp<ViewStyle>;
  data: Place;
};

export const PlaceItem = ({ style, data }: PlaceItemProps) => {
  const [place, setPlace] = useState(data);
  useEffect(() => setPlace(data), [data]);
  const { openPlace } = usePlace();
  return (
    <Wrap
      style={style}
      onPress={() => openPlace(place, (value) => setPlace(value))}
    >
      <Shadow
        offset={[0, 4]}
        distance={20}
        style={{ borderRadius: 15, marginHorizontal: 25 }}
        startColor={'#00000007'}
      >
        <Body>
          <Photo
            source={{
              uri: place?.square?.url ?? place?.cover?.url,
            }}
          />
          <YLayout>
            <Title>{place.name}</Title>
            <Description>
              {place?.address?.street}
              {place?.address?.number ? `, ${place?.address?.number}` : ''}
            </Description>
            <Description>{place?.address?.district}</Description>
          </YLayout>
        </Body>
      </Shadow>
    </Wrap>
  );
};
