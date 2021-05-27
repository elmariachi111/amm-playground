import { Flex } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import React from 'react';

import { Token } from '../../../lib/Token';

const TokenValueChooser = ({
  tokens,
  selected,
  onTokenChanged,
  children,
  isFirst,
}: {
  tokens: Token[];
  selected: Token | null | undefined;
  onTokenChanged: (symbol: string) => void;
  children: React.ReactNode;
  isFirst?: boolean;
}) => {
  return (
    <Flex
      bg="white"
      p={2}
      border="1px solid"
      borderColor="gray.200"
      align="center"
      {...(isFirst ? { borderTopRadius: 6 } : { borderBottomRadius: 6 })}>
      <Select
        w="240px"
        size="md"
        border="none"
        onChange={(e) => {
          e.stopPropagation();
          onTokenChanged(e.target.value);
        }}>
        <option>select</option>
        {tokens.map((token) => (
          <option
            value={token.symbol}
            key={`from-${token.symbol}`}
            selected={selected === token}>
            {token.symbol}
          </option>
        ))}
      </Select>

      {children}
    </Flex>
  );
};

export default TokenValueChooser;
