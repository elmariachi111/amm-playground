/// <reference types="react-vis-types" />

import 'react-vis/dist/style.css';

import { ChakraProvider, LightMode } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Button from './theme/Button';

const AmmDemo = () => {
  const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
  };

  const theme = extendTheme({
    components: {
      Button,
      Container: {
        sizes: {
          xl: {
            maxW: '1800px',
          },
        },
      },
    },
    config,
  });
  return (
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  );
};

let $app = document.getElementById('app');

ReactDOM.render(<AmmDemo />, $app);
