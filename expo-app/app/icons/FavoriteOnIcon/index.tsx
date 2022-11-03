import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type FavoriteOnIconProps = {} & IconProps;

export const FavoriteOnIcon = ({
  svgProps,
  fill = '#316DFF',
  size = 16,
}: FavoriteOnIconProps) => {
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
          d="M6.492 22.481a.718.718 0 01-.748-.052.748.748 0 01-.354-.657V5.482c0-.42.158-.788.472-1.104.315-.315.682-.473 1.102-.473h11.538c.42 0 .787.158 1.102.473.314.316.472.683.472 1.104v16.29c0 .28-.119.5-.355.657a.717.717 0 01-.747.052l-6.241-2.68-6.241 2.68z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
