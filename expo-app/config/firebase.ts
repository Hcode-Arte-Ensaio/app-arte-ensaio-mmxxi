import { initializeApp } from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDwC_W7kNijW6spE86k9Mt47dPADIIiVNI',
  authDomain: 'conexao-arte.firebaseapp.com',
  projectId: 'conexao-arte',
  storageBucket: 'conexao-arte.appspot.com',
  messagingSenderId: '949002780695',
  appId: '1:949002780695:web:233329a9caeb52ed801c52',
};

const app = initializeApp(firebaseConfig);

export default app;
