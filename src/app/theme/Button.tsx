const Button = {
  baseStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: 'base', // <-- border radius is same for all variants and sizes
  },
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4,
      py: 3,
    },
    md: {
      fontSize: 'md',
      px: 6,
      py: 4,
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: '2px solid',
      //borderColor: 'purple.500',
      //color: 'purple.500',
    },
    solid: {
      //bg: 'purple.500',
      color: 'white',
    },
    link: {},
  },
  // The default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
};

export default Button;
