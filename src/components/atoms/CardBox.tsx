import { Box, Flex } from '@chakra-ui/layout';
import { useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const CardBox = ({ children }: { children: React.ReactNode }) => {
  const border = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      rounded="md"
      overflow="hidden"
      shadow="sm"
      border="1px solid"
      borderColor={border}>
      <Flex height="7px" bg="green.400"></Flex>
      {children}
    </Box>
  );
};
export default CardBox;
