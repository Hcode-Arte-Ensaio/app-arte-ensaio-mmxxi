import styled from '@emotion/native';
import { StarHalfIcon } from '../../icons/StarHalfIcon';
import { StarOffIcon } from '../../icons/StarOffIcon';
import { StarOnIcon } from '../../icons/StarOnIcon';
import { useState, useEffect } from 'react';
import { getValidRateValue } from '../../utils/getValidRateValue';

const Wrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

export type RatingStarsProps = {
  value: number;
  size?: number;
};

export const RatingStars = ({ value, size = 32 }: RatingStarsProps) => {
  const [rate, setRate] = useState(value);
  const [stars, setStars] = useState<number[]>([]);

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
            return <StarOffIcon size={size} key={index} />;
          case 1:
            return <StarHalfIcon size={size} key={index} />;
          case 2:
            return <StarOnIcon size={size} key={index} />;
        }
      })}
    </Wrap>
  );
};
