import styled from '@emotion/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screens, Screen } from '../values/screens';
import { ScreenProvider } from '../contexts/ScreenContext';
import { ScreenContent } from '../components/ScreenContent';
import { Colors, ColorsBackground } from '../values/colors';
import { ScreenToolbar } from '../components/ScreenToolbar';
import { H1 } from '../components/H1';
import conexaoArte from '../../assets/partners/conexao-arte.png';
import arteEnsaio from '../../assets/partners/arte-ensaio.png';
import associacao from '../../assets/partners/associacao.png';
import eTamussino from '../../assets/partners/e-tamussino.png';
import ezTec from '../../assets/partners/ez-tec.png';
import fsbComunicacao from '../../assets/partners/fsb-comunicacao.png';
import hcode from '../../assets/partners/hcode.png';
import neo from '../../assets/partners/neo.png';
import saoPaulo from '../../assets/partners/sao-paulo.png';
import tivit from '../../assets/partners/tivit.png';
import valid from '../../assets/partners/valid.png';
import vinci from '../../assets/partners/vinci.png';
import { PaddingSides } from '../components/PaddingSides';

const Text = styled.Text`
  font-size: 16px;
  line-height: 24px;
  font-weight: 300;
  text-align: justify;
  color: ${Colors.Black};
`;

const Logo = styled.Image`
  margin: 25px;
`;

const ScrollView = styled.ScrollView`
  flex: 1;
`;

type AboutScreenProps = NativeStackScreenProps<typeof Screens, Screen.About>;

export const AboutScreen = ({ navigation }: AboutScreenProps) => {
  return (
    <ScreenProvider>
      <ScreenContent
        colors={[...ColorsBackground, '#FFF']}
        locations={[0.1, 0.1, 0.1, 0.7]}
        style={{ height: 'auto' }}
      >
        <ScreenToolbar onPressBack={() => navigation.navigate(Screen.Places)} />
        <H1 blackText="Sobre" redText="Conexão Arte" />
        <PaddingSides>
          <Text>
            Este app foi desenvolvido em curso gratiuito ministrado pela Hcode
            Treinamentos junto com a Arte e Ensaio e com apoio da Prefeitura de
            São Paulo e os seguintes patrocinadores:
          </Text>
          <Logo source={conexaoArte} />
          <Logo source={hcode} />
          <Logo source={arteEnsaio} />
          <Logo source={saoPaulo} />
          <Logo source={vinci} />
          <Logo source={valid} />
          <Logo source={tivit} />
          <Logo source={neo} />
          <Logo source={fsbComunicacao} />
          <Logo source={ezTec} />
          <Logo source={eTamussino} />
          <Logo source={associacao} />
        </PaddingSides>
      </ScreenContent>
    </ScreenProvider>
  );
};
