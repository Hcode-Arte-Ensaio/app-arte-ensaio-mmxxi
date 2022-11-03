import styled from '@emotion/native';
import { Colors } from '../../values/colors';

const Wrap = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 25px;
  padding-right: 25px;
`;
const H1Black = styled.Text`
  color: ${Colors.Black};
  font-size: 32px;
  font-weight: bold;
`;
const H1Red = styled.Text`
  color: ${Colors.Red};
  font-size: 32px;
  font-weight: bold;
  margin-left: 10px;
`;

export type H1Props = {
  blackText: string;
  redText: string;
};

export const H1 = ({ blackText, redText }: H1Props) => {
  return (
    <Wrap>
      <H1Black>{blackText}</H1Black>
      <H1Red>{redText}</H1Red>
    </Wrap>
  );
};
