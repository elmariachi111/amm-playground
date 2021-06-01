/// <reference types="react-vis-types" />

import 'react-vis/dist/style.css';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';

import { ChakraProvider, LightMode } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import theme from './theme';

const AmmDemo = () => {
  return (
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  );
};

let $app = document.getElementById('app');

ReactDOM.render(<AmmDemo />, $app);
