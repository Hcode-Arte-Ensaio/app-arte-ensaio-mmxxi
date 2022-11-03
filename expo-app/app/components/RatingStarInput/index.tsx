import styled from '@emotion/native';
import { StarHalfIcon } from '../../icons/StarHalfIcon';
import { StarOffIcon } from '../../icons/StarOffIcon';
import { StarOnIcon } from '../../icons/StarOnIcon';
import { useState, useEffect, useCallback } from 'react';
import { getValidRateValue } from '../../utils/getValidRateValue';
import { StarOutlineIcon } from '../../icons/StarOutlineIcon';

const Wrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Button = styled.TouchableOpacity``;

export type RatingStarInputProps = {
  value?: number;
  size?: number;
  onChange?: (value: number) => void;
};

export const RatingStarInput = ({
  value = 0,
  size = 32,
  onChange,
}: RatingStarInputProps) => {
  const [rate, setRate] = useState(value);
  const [stars, setStars] = useState<number[]>([]);

  const setStar = useCallback((index: number) => {
    setRate(index + 1);
    if (typeof onChange === 'function') {
      onChange(index + 1);
    }
  }, []);

  useEffect(() => {
    setRate(getValidRateValue(value));
  }, [value]);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 5; i++) {
      const diff = Number(Number(rate - i).toPrecision(1));
      const result =
        i < rate
          ? diff < 1 && diff >= 0.5
            ? 1
            : diff > 0 && diff < 0.5
            ? 0
            : 2
          : 0;
      arr.push(result);
    }
    setStars([...arr]);
  }, [rate]);

  return (
    <Wrap>
      {stars.map((star, index) => {
        switch (star) {
          case 0:
            return (
              <Button
                key={index}
                onPress={() => setStar(index)}
                activeOpacity={0.5}
              >
                <StarOutlineIcon size={size} />
              </Button>
            );
          case 1:
            return (
              <Button
                key={index}
                onPress={() => setStar(index)}
                activeOpacity={0.5}
              >
                <StarHalfIcon size={size} />
              </Button>
            );
          case 2:
            return (
              <Button
                key={index}
                onPress={() => setStar(index)}
                activeOpacity={0.5}
              >
                <StarOnIcon size={size} />
              </Button>
            );
        }
      })}
    </Wrap>
  );
};
