import styled from '@emotion/native';
import { MenuIcon } from '../../icons/MenuIcon';
import { Avatar } from '../Avatar';
import { ButtonIcon } from '../ButtonIcon';
import { Colors } from '../../values/colors';
import { useDrawerNavigation } from '../../hooks/useDrawerNavigation';
import { useAuth } from '../../contexts/AuthContext';

const Wrap = styled.View`
  flex-direction: row;
  width: 100%;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 10px;
`;

const HeaderTitle = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  padding-left: 20px;
`;

const HeaderTitleText = styled.Text<{ size: number }>`
  font-size: ${(props) => (props.size > 0 ? String(props.size) : '22')}px;
  font-weight: 500;
  color: ${Colors.Black};
`;
const HeaderSubtitleText = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: ${Colors.Gray};
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export const Header = ({ title, subtitle }: HeaderProps) => {
  const { user } = useAuth();
  const navigation = useDrawerNavigation();
  const { setOpen, open } = useAuth();
  return (
    <Wrap>
      <Avatar
        onPress={() => setOpen(!open)}
        imageProps={{
          source: {
            uri: 'https://lh3.googleusercontent.com/a/ALm5wu0YDxBadEeseByOOaLgr0CrcGCbAuOd3-1VEVfh8Bo=s83-c-mo',
          },
        }}
      />
      <Button onPress={() => setOpen(!open)}>
        <HeaderTitle>
          <HeaderTitleText size={subtitle !== undefined ? 18 : 22}>
            {title}
          </HeaderTitleText>
          {subtitle && <HeaderSubtitleText>{subtitle}</HeaderSubtitleText>}
        </HeaderTitle>
      </Button>
      <ButtonIcon
        icon={<MenuIcon size={32} />}
        touchableProps={{ onPress: () => navigation.toggleDrawer() }}
      />
    </Wrap>
  );
};
