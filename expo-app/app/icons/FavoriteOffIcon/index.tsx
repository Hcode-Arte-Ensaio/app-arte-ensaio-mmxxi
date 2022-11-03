import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type FavoriteOffIconProps = {} & IconProps;

export const FavoriteOffIcon = ({
  svgProps,
  fill = '#316DFF',
  size = 16,
}: FavoriteOffIconProps) => {
  return (
    <Icon style={{ height: size }}>
      <Svg
        height="100%"
        width="100%"
        preserveAspectRatio="xMinYMin slice"
        viewBox="0 0 26 27"
        {...svgProps}
      >
        <Path
          d="M5.244 22.024V4.588c0-.42.157-.786.472-1.1.314-.316.681-.473 1.1-.473h11.537c.42 0 .787.157 1.101.472.315.315.472.682.472 1.101v17.436l-7.341-3.146-7.341 3.146zm1.573-2.386l5.768-2.439 5.768 2.439V4.588H6.817v15.05zm0-15.05h11.536H6.817z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
