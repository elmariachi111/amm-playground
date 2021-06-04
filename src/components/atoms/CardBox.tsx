import { Box, Flex } from '@chakra-ui/layout';
import React from 'react';

const CardBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box rounded={8} shadow="md" border="1px solid" borderColor="gray.300">
      <Flex height="7px" bg="green.400"></Flex>
      {children}
    </Box>
  );
};
export default CardBox;
