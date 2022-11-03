import Svg, { Path } from 'react-native-svg';
import { Icon, IconProps } from '../Icon';

export type StarOnIconProps = {} & IconProps;

export const StarOnIcon = ({
  svgProps,
  fill = '#FED12E',
  size = 16,
}: StarOnIconProps) => {
  return (
    <Icon
      style={{
        height: size,
      }}
    >
      <Svg
        height="100%"
        width="100%"
        preserveAspectRatio="xMinYMin slice"
        viewBox="0 0 48 48"
        {...svgProps}
      >
        <Path
          d="M24 36.55l-9.3 5.6a1.49 1.49 0 01-1.65-.05 1.545 1.545 0 01-.525-.65c-.117-.267-.142-.567-.075-.9l2.45-10.6-8.2-7.15c-.267-.233-.425-.492-.475-.775a1.96 1.96 0 01.025-.825 1.22 1.22 0 01.45-.675 1.6 1.6 0 01.85-.325l10.85-.95 4.2-10a1.4 1.4 0 01.6-.675 1.62 1.62 0 01.8-.225c.267 0 .533.075.8.225a1.4 1.4 0 01.6.675l4.2 10 10.85.95a1.6 1.6 0 01.85.325c.233.183.383.408.45.675.067.267.075.542.025.825-.05.283-.208.542-.475.775l-8.2 7.15 2.45 10.6c.067.333.042.633-.075.9a1.545 1.545 0 01-.525.65 1.49 1.49 0 01-1.65.05l-9.3-5.6z"
          fill={fill}
        />
      </Svg>
    </Icon>
  );
};
