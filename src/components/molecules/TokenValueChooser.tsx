import { Flex } from '@chakra-ui/layout';
import { useColorModeValue } from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import React from 'react';

import { setField } from '../../helpers';
import { Token } from '../../lib/Token';

const TokenValueChooser = ({
  tokens,
  selected,
  onTokenChanged,
  children,
  isFirst,
  footer,
}: {
  tokens: Token[];
  selected: Token | null | undefined;
  onTokenChanged: (symbol: string) => void;
  children: React.ReactNode;
  isFirst?: boolean;
  footer?: React.ReactNode;
}) => {
  const bg = useColorModeValue('white', 'gray.700');
  const border = useColorModeValue('gray.200', 'gray.700');
  return (
    <Flex
      bg={bg}
      border="1px solid"
      borderColor={border}
      direction="column"
      p={2}
      {...(isFirst ? { borderTopRadius: 6 } : { borderBottomRadius: 6 })}>
      <Flex direction="row" align="center">
        <Select
          w="240px"
          size="md"
          border="none"
          onChange={setField(onTokenChanged)}
          value={selected?.symbol}>
          <option value={''}>select</option>
          {tokens.map((token) => (
            <option value={token.symbol} key={`from-${token.symbol}`}>
              {token.symbol}
            </option>
          ))}
        </Select>
        {children}
      </Flex>
      <Flex justify="flex-end">{footer}</Flex>
    </Flex>
  );
};

export default TokenValueChooser;
