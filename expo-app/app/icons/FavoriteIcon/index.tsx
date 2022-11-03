import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type FavoriteIconProps = {} & IconProps;

export const FavoriteIcon = ({
  svgProps,
  fill = '#5C6782',
  size = 32,
}: FavoriteIconProps) => {
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
          d="M27 27.667a.971.971 0 01-.717-.284.971.971 0 01-.283-.716V3.333H8.767a.971.971 0 01-.717-.283.971.971 0 01-.283-.717c0-.289.094-.527.283-.716a.971.971 0 01.717-.284H26c.533 0 1 .2 1.4.6.4.4.6.867.6 1.4v23.334a.971.971 0 01-.283.716.971.971 0 01-.717.284zm-21-.034l8-3.433 8 3.433v-20.3H6v20.3zm-.6 2.434c-.333.155-.65.139-.95-.05-.3-.19-.45-.473-.45-.85V7.333c0-.533.2-1 .6-1.4.4-.4.867-.6 1.4-.6h16c.533 0 1.006.2 1.417.6.41.4.616.867.616 1.4v21.834c0 .377-.15.655-.45.833-.3.178-.616.2-.95.067L14 26.433l-8.6 3.634zM6 7.333h16H6z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
