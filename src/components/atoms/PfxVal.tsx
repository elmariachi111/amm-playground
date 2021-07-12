import { Flex, Text } from '@chakra-ui/layout';
import React from 'react';

import { currency } from '../../helpers';

const PfxVal = (props: {
  pfx: string;
  val: string | number | undefined;
  sfx?: string;
  onClick?: () => void;
  [x: string]: any;
}) => {
  const { pfx, val, sfx, onClick, ...restProps } = props;

  let Val: React.ReactNode;
  switch (typeof val) {
    case 'number':
      Val = (
        <Text title={val.toString()} ml={1} fontSize="sm">
          {currency(val, false)}
        </Text>
      );
      break;
    case 'string':
      Val = (
        <Text ml={1} fontSize="sm">
          {val}
        </Text>
      );
      break;
    default:
      Val = (
        <Text color="gray.300" ml={1} fontSize="sm">
          -
        </Text>
      );
  }

  return (
    <Flex {...restProps} onClick={onClick} align="baseline">
      <Text color="gray.400" textTransform="uppercase" fontSize="xs" fontWeight="medium">
        {pfx}
      </Text>

      {Val}

      {sfx && (
        <Text fontSize="sm" ml={1}>
          {sfx}
        </Text>
      )}
    </Flex>
  );
};

export default PfxVal;
