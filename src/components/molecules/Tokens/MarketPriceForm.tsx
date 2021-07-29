import { Flex, Text } from '@chakra-ui/layout';
import { Icon, Input } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { MdEdit } from 'react-icons/md';

import { currency, setNumericalField } from '../../../helpers';
import { Token } from '../../../lib/Token';
import { PfxText } from '../../atoms/PfxText';

const MarketPriceForm = ({ token }: { token: Token }) => {
  const [marketPrice, setMarketPrice] = useState<number | undefined>(token.marketPrice);
  const [isEditor, setEditor] = useState<boolean>(false);
  const inp = useRef(null);

  useEffect(() => {
    const off = [
      token.on('MarketPriceUpdated', (args) => {
        setMarketPrice(args.price);
      }),
    ];
    return () => {
      off.map((_off) => _off());
    };
  }, [token]);

  const submit = () => {
    if (!marketPrice) return;
    token.setMarketPrice(marketPrice);
    setEditor(false);
  };

  return (
    <Flex direction="column">
      <Flex
        gridGap={2}
        onClick={() => {
          setEditor(true);
        }}>
        <PfxText>Price</PfxText>
        <Icon as={MdEdit} w={3} color="gray.400" />
      </Flex>
      {isEditor ? (
        <Flex as="form" onSubmit={submit} direction="row" align="baseline">
          <Text fontSize="sm">$</Text>
          <Input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            ref={inp}
            step="0.00001"
            type="number"
            variant="flushed"
            placeholder="price"
            width="10"
            fontSize="sm"
            size="xs"
            value={marketPrice}
            onBlur={submit}
            onChange={setNumericalField(setMarketPrice)}
          />
        </Flex>
      ) : (
        <Text
          fontSize="sm"
          onClick={() => {
            setEditor(true);
          }}>
          {marketPrice && currency(marketPrice, true)}
        </Text>
      )}
    </Flex>
  );
};

export default MarketPriceForm;
