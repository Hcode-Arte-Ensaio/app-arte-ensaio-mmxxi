import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type DeleteIconProps = {} & IconProps;

export const DeleteIcon = ({
  svgProps,
  fill = '#5C6782',
  size = 32,
}: DeleteIconProps) => {
  return (
    <Icon style={{ height: size }}>
      <Svg
        height="100%"
        width="100%"
        preserveAspectRatio="xMinYMin slice"
        viewBox="0 0 24 24"
        {...svgProps}
      >
        <Path
          d="M6.525 21c-.4 0-.75-.15-1.05-.45-.3-.3-.45-.65-.45-1.05V5.25H4.75A.728.728 0 014 4.5a.728.728 0 01.75-.75H8.7A.728.728 0 019.45 3h5.1a.728.728 0 01.75.75h3.95a.728.728 0 01.75.75.728.728 0 01-.75.75h-.275V19.5c0 .4-.15.75-.45 1.05-.3.3-.65.45-1.05.45H6.525zm0-15.75V19.5h10.95V5.25H6.525zm2.65 11.35a.728.728 0 00.75.75.728.728 0 00.75-.75V8.125a.728.728 0 00-.75-.75.728.728 0 00-.75.75V16.6zm4.15 0a.728.728 0 00.75.75.728.728 0 00.75-.75V8.125a.728.728 0 00-.75-.75.728.728 0 00-.75.75V16.6zm-6.8-11.35V19.5 5.25z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
