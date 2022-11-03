import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type StarIconProps = {} & IconProps;

export const StarIcon = ({
  svgProps,
  fill = '#fff',
  size = 32,
}: StarIconProps) => {
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
          d="M8.075 18.875L12 16.525l3.925 2.375-1.05-4.45 3.45-3-4.55-.4L12 6.85l-1.775 4.175-4.55.4 3.45 3-1.05 4.45zm3.925-.6l-4.65 2.8a.745.745 0 01-.825-.025.738.738 0 01-.3-.775l1.225-5.3-4.1-3.575a.67.67 0 01-.237-.388.98.98 0 01.012-.412.61.61 0 01.225-.338.8.8 0 01.425-.162L9.2 9.625l2.1-5a.7.7 0 01.3-.338.81.81 0 01.4-.112.81.81 0 01.4.112.7.7 0 01.3.338l2.1 5 5.425.475a.8.8 0 01.425.162.61.61 0 01.225.338.98.98 0 01.012.412.67.67 0 01-.237.388l-4.1 3.575 1.225 5.3a.739.739 0 01-.3.775.745.745 0 01-.825.025l-4.65-2.8z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
