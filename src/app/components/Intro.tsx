import { Button } from '@chakra-ui/button';
import { CloseButton } from '@chakra-ui/close-button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  Box,
  Link,
  Text
} from '@chakra-ui/layout';
import { Collapse } from '@chakra-ui/transition';
import React from 'react';

export default function Intro({setDefaults}: {setDefaults: () => void}) {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  const heroBg = useColorModeValue('gray.200', 'gray.600');
  const linkColor = useColorModeValue('linkedin.600', 'linkedin.300');
  
  return( <Collapse  in={isOpen}>
    <Box rounded="xl" bg={heroBg} p={3} position="relative">
      <CloseButton onClick={onClose} position="absolute" right={2} />
      <Text>This is an <Link isExternal href="https://academy.binance.com/en/articles/what-is-an-automated-market-maker-amm" color={linkColor}>automated market maker</Link> simulator. {' '}
      <b>It's all <Link color={linkColor} isExternal href="https://github.com/elmariachi111/amm-playground">built in plain Typescript</Link>, no chain, no gas, no tx, no db involved.</b></Text>
      <Box my={3}>
      <Text>1. create some tokens ("DAI"). Eth is a default</Text>
      <Text>2. Mint some tokens. Use real names as addresses (10 Eth -> "stadolf")</Text>
      <Text>3. Create a new pool using two tokens</Text>
      <Text>4. add Liquidity to the new pool</Text>
      <Text>5. swap one token for another using another user</Text>
      </Box>
      <Box mt={5} >
        <Button colorScheme="linkedin"  onClick={setDefaults}>Set some defaults</Button>
      </Box>
    </Box>
  </Collapse>)
}
