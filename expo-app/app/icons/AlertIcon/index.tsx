import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type AlertIconProps = {} & IconProps;

export const AlertIcon = ({
  svgProps,
  fill = '#5C6782',
  size = 32,
}: AlertIconProps) => {
  return (
    <Icon style={{ height: size }}>
      <Svg
        height="100%"
        width="100%"
        preserveAspectRatio="xMinYMin slice"
        viewBox="0 0 32 32"
        {...svgProps}
      >
        <Path
          d="M3.067 28c-.378 0-.667-.167-.867-.5a.908.908 0 010-1L15.133 4.167c.2-.334.49-.5.867-.5.378 0 .667.166.867.5L29.8 26.5c.2.333.2.667 0 1-.2.333-.489.5-.867.5H3.067zm13.066-15.067a.97.97 0 00-.716.284.971.971 0 00-.284.716V19.4a.971.971 0 001 1 .971.971 0 00.717-.283.971.971 0 00.283-.717v-5.467a.971.971 0 00-.283-.716.971.971 0 00-.717-.284zm0 11.167a.971.971 0 00.717-.283.971.971 0 00.283-.717.971.971 0 00-.283-.717.971.971 0 00-.717-.283.97.97 0 00-.716.283.971.971 0 00-.284.717.971.971 0 001 1zM4.8 26h22.4L16 6.667 4.8 26z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
