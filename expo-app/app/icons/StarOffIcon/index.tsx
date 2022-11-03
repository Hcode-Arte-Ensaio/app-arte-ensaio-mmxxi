import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type StarOffIconProps = {} & IconProps;

export const StarOffIcon = ({
  svgProps,
  fill = '#fff',
  size = 16,
}: StarOffIconProps) => {
  return (
    <Icon style={{ height: size }}>
      <Svg
        height="80%"
        width="100%"
        preserveAspectRatio="xMinYMin slice"
        viewBox="0 0 25 25"
        {...svgProps}
      >
        <Path
          opacity={0.5}
          d="M12.803 13.671l-4.28 2.583a.685.685 0 01-.76-.023.683.683 0 01-.276-.715l1.127-4.889L4.84 7.33a.619.619 0 01-.219-.358.906.906 0 01.012-.38c.03-.123.1-.227.207-.311a.736.736 0 01.391-.15l4.995-.438 1.933-4.612a.646.646 0 01.276-.312.744.744 0 01.368-.103c.123 0 .246.034.368.103.123.07.215.173.277.312l1.933 4.612 4.994.438a.736.736 0 01.392.15.563.563 0 01.207.31c.03.124.034.25.011.381a.619.619 0 01-.218.358l-3.775 3.297 1.128 4.889a.683.683 0 01-.276.715.685.685 0 01-.76.023l-4.28-2.583z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
