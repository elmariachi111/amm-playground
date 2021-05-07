import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const AmmDemo = () => {
  return (
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
};

let $app = document.getElementById('app');

ReactDOM.render(<AmmDemo />, $app);
