/// <reference types="react-vis-types" />

import 'react-vis/dist/style.css';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';

import { ChakraProvider, LightMode } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Button from './theme/Button';

const AmmDemo = () => {
  const theme = extendTheme({
    fonts: {
      body: 'Roboto',
      heading: 'Roboto',
    },
    textStyles: {
      h2: {
        color: 'red',
        fontWeight: '300',
      },
    },
    components: {
      Button,
      Heading: {
        baseStyle: {
          fontWeight: 400,
        },
      },
      Container: {
        sizes: {
          xl: {
            maxW: '1800px',
          },
        },
      },
    },
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
  });
  return (
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  );
};

let $app = document.getElementById('app');

ReactDOM.render(<AmmDemo />, $app);
