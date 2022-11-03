import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type MenuIconProps = {} & IconProps;

export const MenuIcon = ({
  svgProps,
  fill = '#222429',
  size = 16,
}: MenuIconProps) => {
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
          d="M5 24a.971.971 0 01-.717-.283A.971.971 0 014 23c0-.289.094-.528.283-.717A.971.971 0 015 22h22c.289 0 .528.094.717.283A.971.971 0 0128 23a.971.971 0 01-.283.717A.971.971 0 0127 24H5zm0-7a.971.971 0 01-.717-.283A.971.971 0 014 16c0-.289.094-.528.283-.717A.971.971 0 015 15h22c.289 0 .528.094.717.283A.971.971 0 0128 16a.971.971 0 01-.283.717A.971.971 0 0127 17H5zm0-7a.971.971 0 01-.717-.283A.971.971 0 014 9c0-.289.094-.528.283-.717A.971.971 0 015 8h22c.289 0 .528.094.717.283A.971.971 0 0128 9a.971.971 0 01-.283.717A.971.971 0 0127 10H5z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
