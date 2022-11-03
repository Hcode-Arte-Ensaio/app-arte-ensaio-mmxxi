import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type BackIconProps = {} & IconProps;

export const BackIcon = ({
  svgProps,
  fill = '#222429',
  size = 16,
}: BackIconProps) => {
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
          d="M7.45 12.983L2.817 8.35a.508.508 0 01-.117-.167A.49.49 0 012.667 8a.49.49 0 01.033-.183.508.508 0 01.117-.167L7.467 3a.452.452 0 01.333-.133c.133 0 .25.05.35.15a.48.48 0 010 .7L4.367 7.5h8.266a.486.486 0 01.5.5.485.485 0 01-.5.5H4.367l3.8 3.8c.089.089.133.2.133.333a.48.48 0 01-.15.35.48.48 0 01-.7 0z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
