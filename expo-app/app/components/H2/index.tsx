import styled from '@emotion/native';
import { Colors } from '../../values/colors';

const Wrap = styled.View``;
const Title = styled.Text`
  color: ${Colors.Black};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export type H2Props = {
  title: string;
};

export const H2 = ({ title }: H2Props) => {
  return (
    <Wrap>
      <Title>{title}</Title>
    </Wrap>
  );
};
