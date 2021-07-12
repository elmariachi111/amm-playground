import { useColorMode } from '@chakra-ui/color-mode';
import Icon from '@chakra-ui/icon';
import { Image } from '@chakra-ui/image';
import { Box, Container, Flex, Link, Spacer, Text } from '@chakra-ui/layout';
import { IconButton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { BiMoon, BiSun } from 'react-icons/bi';
import { FaGithub } from 'react-icons/fa';

import TXBLogo from './logo_txb_black.svg';

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.100', 'gray.600');
  const border = useColorModeValue('gray.200', 'gray.500');
  return (
    <Box bg={bg} borderBottom="1px solid" borderColor={border}>
      <Container maxW="1800px">
        <Flex color="gray.400" direction="row" alignItems="center" gridGap={8} py={3}>
          <Flex>
            <Text>built by </Text>
            <Link isExternal href="https://turbinekreuzberg.com">
              <Image src={TXBLogo} w={100} ml={3} opacity={0.3} />
            </Link>
          </Flex>
          <Flex>
            <Text>code on</Text>
            <Link
              color="gray.400"
              isExternal
              href="https://github.com/elmariachi111/amm-playground">
              <Icon as={FaGithub} w={6} h={6} ml={3} />
            </Link>
          </Flex>
          <Text>
            reach out via{' '}
            <Link textDecoration="underline" href="mailto:hello@turbinekreuzberg.com">
              email
            </Link>
          </Text>
          <Spacer />
          <Flex>
            <IconButton
              size="sm"
              aria-label="Switch Color Mode"
              variant="ghost"
              icon={colorMode == 'dark' ? <BiSun /> : <BiMoon />}
              onClick={toggleColorMode}
            />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
