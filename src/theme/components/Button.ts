const Button = {
  baseStyle: {
    fontWeight: 600,
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
      py: 5,
    },
    lg: {
      fontSize: 'md',
      px: 6,
      py: 5,
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: '2px solid',
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
