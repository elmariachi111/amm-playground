import { useColorModeValue } from '@chakra-ui/react';
import { Tr as ChTr } from '@chakra-ui/table';
import React from 'react';

const Tr = ({
  odd,
  children,
}: {
  odd?: undefined | boolean;
  children: React.ReactNode;
}) => {
  const bgOdd = useColorModeValue('white', 'gray.600');
  const bgEven = useColorModeValue('gray.75', 'gray.700');

  return <ChTr bg={odd ? bgOdd : bgEven}>{children}</ChTr>;
};
export default Tr;
