import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type CloseIconProps = {} & IconProps;

export const CloseIcon = ({
  svgProps,
  fill = '#000',
  size = 16,
}: CloseIconProps) => {
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
          d="M8 8.7l-3.5 3.5a.48.48 0 01-.7 0 .48.48 0 010-.7L7.3 8 3.8 4.5a.48.48 0 010-.7.48.48 0 01.7 0L8 7.3l3.5-3.5a.48.48 0 01.7 0 .48.48 0 010 .7L8.7 8l3.5 3.5a.48.48 0 010 .7.48.48 0 01-.7 0L8 8.7z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
