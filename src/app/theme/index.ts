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
      75: '#f2f2fd',
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
  fontSizes: {
    // xs: '0.7rem',
    // sm: '0.8rem',
    // md: '0.9rem',
    // lg: '1.1rem',
    // xl: '1.2rem',
    // '2xl': '1.5rem',
    // '3xl': '1.875rem',
    // '4xl': '2.25rem',
    // '5xl': '3rem',
    // '6xl': '3.75rem',
    // '7xl': '4.5rem',
    // '8xl': '6rem',
    // '9xl': '8rem',
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
