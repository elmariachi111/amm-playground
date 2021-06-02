import { extendTheme } from '@chakra-ui/react';

import Button from './components/Button';

export default extendTheme({
  styles: {
    global: {
      html: {
        fontSize: '90%',
      },
    },
  },
  colors: {
    gray: {
      75: '#f7f8fa',
      100: '#f6f9ff',
    },
    green: {
      500: '#1dd08e',
      600: '#1dd08e',
    },
  },
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
    Link: {
      baseStyle: {
        color: 'linkedin.500',
      },
    },
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
