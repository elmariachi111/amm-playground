import { Flex, Text } from '@chakra-ui/layout';
import React from 'react';

const PfxVal = ({
  pfx,
  val,
  sfx,
}: {
  pfx: string;
  val: string | number | undefined;
  sfx?: string;
}) => {
  let Val: React.ReactNode;
  switch (typeof val) {
    case 'number':
      Val = <Text title={val.toString()}>{val.toFixed(2)}</Text>;
      break;
    case 'string':
      Val = <Text>{val}</Text>;
      break;
    default:
      Val = <Text fontColor="gray.300">-</Text>;
  }

  return (
    <Flex align="center">
      <Text
        color="gray.400"
        textTransform="uppercase"
        mr={2}
        fontSize="xs"
        fontWeight="medium">
        {pfx}
      </Text>
      {Val}
      {val && sfx && <Text ml={1}>{sfx}</Text>}
    </Flex>
  );
};

export default PfxVal;
