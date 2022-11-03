import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type LogoutIconProps = {} & IconProps;

export const LogoutIcon = ({
  svgProps,
  fill = '#fff',
  size = 16,
}: LogoutIconProps) => {
  return (
    <Icon style={{ height: size }}>
      <Svg
        height="100%"
        width="100%"
        preserveAspectRatio="xMinYMin slice"
        viewBox="0 0 18 18"
        {...svgProps}
      >
        <Path
          d="M13.125 12.825a.748.748 0 01-.225-.55c0-.217.075-.392.225-.525l2-2h-8a.728.728 0 01-.75-.75.728.728 0 01.75-.75h7.95L13.05 6.225a.694.694 0 01-.2-.512c0-.209.075-.388.225-.538.15-.15.33-.225.538-.225.208 0 .387.075.537.225L17.475 8.5a.762.762 0 01.175.25c.033.083.05.175.05.275 0 .1-.017.192-.05.275a.762.762 0 01-.175.25l-3.3 3.3a.694.694 0 01-.513.2.734.734 0 01-.537-.225zM1.5 18c-.4 0-.75-.15-1.05-.45-.3-.3-.45-.65-.45-1.05v-15C0 1.1.15.75.45.45.75.15 1.1 0 1.5 0h6.525a.728.728 0 01.75.75.728.728 0 01-.75.75H1.5v15h6.525a.728.728 0 01.75.75.728.728 0 01-.75.75H1.5z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
