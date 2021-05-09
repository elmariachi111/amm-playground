import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const AmmDemo = () => {
  const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  };
  const theme = extendTheme({ config });
  return (
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  );
};

let $app = document.getElementById('app');

ReactDOM.render(<AmmDemo />, $app);
