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
        <ScrollView>
          <H1 blackText="Sobre" redText="Conexão Arte" />
          <PaddingSides>
            <Text>
              Este app foi desenvolvido com incentivo fiscal, PROMAC, Programa de Incentivo à Cultura da Secretaria Municipal de Cultura de São Paulo.
              Curso gratuito ministrado pela Hcode
              Treinamentos junto com a Artemídia.
            </Text>
            <Logo source={saoPaulo} />
            <Logo source={conexaoArte} />
            <Logo source={hcode} />
            <Logo source={vinci} />
            <Logo source={valid} />
            <Logo source={tivit} />
            <Logo source={neo} />
            <Logo source={fsbComunicacao} />
            <Logo source={ezTec} />
            <Logo source={eTamussino} />
            <Logo source={associacao} />
          </PaddingSides>
        </ScrollView>
      </ScreenContent>
    </ScreenProvider>
  );
};
