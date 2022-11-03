import styled from '@emotion/native';
import { SvgProps } from 'react-native-svg';

export type IconProps = {
  svgProps?: SvgProps;
  fill?: string;
  size?: number;
};

export const Icon = styled.View`
  aspect-ratio: 1;
  height: 32px;
  justify-content: center;
  align-items: center;
`;
