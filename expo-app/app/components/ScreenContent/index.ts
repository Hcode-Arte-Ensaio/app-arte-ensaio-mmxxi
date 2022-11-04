import styled from '@emotion/native';
import { Dimensions } from 'react-native';
import { Canvas } from '../Canvas';

export const ScreenContent = styled(Canvas)`
  padding: 18px 0;
  min-height: ${String(Dimensions.get('window').height)}px;
`;
