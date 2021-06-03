import { Tr as ChTr } from '@chakra-ui/table';
import React from 'react';

const Tr = ({
  odd,
  children,
}: {
  odd?: undefined | boolean;
  children: React.ReactNode;
}) => <ChTr bg={odd ? 'white' : 'gray.75'}>{children}</ChTr>;

export default Tr;
