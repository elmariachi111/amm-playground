import { Text } from '@chakra-ui/layout';
import React from 'react';

const PfxText = ({ children }: { children: React.ReactNode }) => (
  <Text color="gray.400" textTransform="uppercase" fontSize="xs" fontWeight="medium">
    {children}
  </Text>
);

export { PfxText };
