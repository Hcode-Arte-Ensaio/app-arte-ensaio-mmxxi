import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type EditIconProps = {} & IconProps;

export const EditIcon = ({
  svgProps,
  fill = '#222429',
  size = 32,
}: EditIconProps) => {
  return (
    <Icon style={{ height: size }}>
      <Svg
        height="100%"
        width="100%"
        preserveAspectRatio="xMinYMin slice"
        viewBox="0 0 16 16"
        {...svgProps}
      >
        <Path
          d="M3 13h.733l7.384-7.383-.734-.734L3 12.267V13zm10.233-8.1L11.1 2.767l.7-.7a.933.933 0 01.708-.275.99.99 0 01.709.291l.716.717a.951.951 0 01.284.7.95.95 0 01-.284.7l-.7.7zM2.5 14a.485.485 0 01-.5-.5v-1.433a.49.49 0 01.033-.184.508.508 0 01.117-.166l8.25-8.25L12.533 5.6l-8.25 8.25a.507.507 0 01-.166.117.49.49 0 01-.184.033H2.5zm8.25-8.75l-.367-.367.734.734-.367-.367z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
