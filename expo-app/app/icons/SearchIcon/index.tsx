import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type SearchIconProps = {} & IconProps;

export const SearchIcon = ({
  svgProps,
  fill = '#FF3D46',
  size = 16,
}: SearchIconProps) => {
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
          d="M12.9 13.617L8.883 9.6a3.672 3.672 0 01-1.166.675 4.125 4.125 0 01-1.417.242c-1.2 0-2.217-.417-3.05-1.25C2.417 8.433 2 7.427 2 6.25c0-1.178.417-2.183 1.25-3.017.833-.833 1.844-1.25 3.033-1.25 1.178 0 2.18.417 3.009 1.25.827.834 1.241 1.84 1.241 3.017A4.156 4.156 0 019.6 8.883l4.05 4.017c.1.089.15.203.15.342a.518.518 0 01-.167.375c-.1.1-.222.15-.366.15a.499.499 0 01-.367-.15zm-6.617-4.1c.9 0 1.667-.32 2.3-.959a3.16 3.16 0 00.95-2.308c0-.9-.316-1.67-.95-2.308a3.119 3.119 0 00-2.3-.959c-.91 0-1.686.32-2.325.959A3.146 3.146 0 003 6.25c0 .9.32 1.67.958 2.308a3.166 3.166 0 002.325.959z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
