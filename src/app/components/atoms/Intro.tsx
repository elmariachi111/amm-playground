import { Button } from '@chakra-ui/button';
import { CloseButton } from '@chakra-ui/close-button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  Box,
  Container,
  Grid,
  Heading,
  Link,
  Text,
  VStack
} from '@chakra-ui/layout';
import { Collapse } from '@chakra-ui/transition';
import React from 'react';

export default function Intro({setDefaults}: {setDefaults: () => void}) {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  const heroBg = useColorModeValue('gray.200', 'gray.600');
  const linkColor = useColorModeValue('linkedin.600', 'linkedin.300');
  
  return( 
  <Box bg="#f2f2fd">
    <Container maxW="1800px">
  
    <Grid
      py={8}
      templateColumns="repeat(3, 1fr)"
      gridGap={12}
      >
      <Box>
        <Heading size="lg">Welcome to the <b>Automated Market Maker</b> Simulator</Heading>
        
        <Text my={3}>This is an <Link isExternal href="https://academy.binance.com/en/articles/what-is-an-automated-market-maker-amm" color={linkColor}>automated market maker</Link> <b>simulator</b>. {' '}
          It's all <Link color={linkColor} isExternal href="https://github.com/elmariachi111/amm-playground">built in <b>plain Typescript</b></Link>, no chain, no gas, no tx, no db involved.
        </Text>
        <Button 
          colorScheme="green"
          variant="link"
          onClick={setDefaults}
        >Set some defaults</Button>
      </Box>

      <Box>
        <Heading size="lg">What to do?</Heading>
        <Text fontSize="sm" color="gray.500">start trying: </Text>
        <Box my={3}>
          <Text>1. create some tokens ("DAI"). Eth is a default</Text>
          <Text>2. Mint some tokens. Use real names as addresses (10 Eth -> "stadolf")</Text>
          <Text>3. Create a new pool using two tokens</Text>
          <Text>4. add Liquidity to the new pool</Text>
          <Text>5. swap one token for another using another user</Text>
        </Box>
      </Box>
      <Box >
        <Heading size="lg">Learn</Heading>
        <Text fontSize="sm" color="gray.500">links to get you started </Text>

        <VStack alignItems="start" spacing={0}  mt={2} fontSize=".9em">
          <Box>
            <Link
              href="https://www.gemini.com/cryptopedia/amm-what-are-automated-market-makers#section-constant-product-formula"
              isExternal>
              Automated Market Makers
            </Link>{' '}
            |{' '}
            <Link href="https://changelly.com/blog/automated-market-maker/" isExternal>
              alt
            </Link>
          </Box>
          <Link href="https://v2.info.uniswap.org/pairs" isExternal>
            Uniswap V2 Pairs
          </Link>
          <Box whiteSpace="nowrap">
            Uniswap Docs:{' '}
            <Link isExternal href="https://uniswap.org/docs/v2/">
              V2
            </Link>{' '}
            |{' '}
            <Link
              isExternal
              href="https://docs.uniswap.org/concepts/introduction/what-is-uniswap">
              V3
            </Link>
          </Box>

          <Link
            href="https://ethresear.ch/t/improving-front-running-resistance-of-x-y-k-market-makers/1281"
            isExternal>
            on front running
          </Link>
        </VStack>

      </Box>
    
    </Grid>
  
  </Container>
  </Box>)
}
