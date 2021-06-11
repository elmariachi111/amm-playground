import { useColorMode } from '@chakra-ui/color-mode';
import Icon from '@chakra-ui/icon';
import { Image } from '@chakra-ui/image';
import { Box, Container, Flex, Link, Text } from '@chakra-ui/layout';
import { Switch } from '@chakra-ui/switch';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

import TXBLogo from './logo_txb_black.png';

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg="gray.100" borderBottom="1px solid" borderColor="gray.200">
      <Container maxW="1800px" py={5}>
        <Flex
          maxW="50%"
          color="gray.400"
          direction="row"
          alignItems="start"
          gridGap={8}
          justify="start">
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
          <Switch size="md" isChecked={colorMode == 'dark'} onChange={toggleColorMode} />
        </Flex>
      </Container>
    </Box>
  );
}
