import { Flex, Text } from '@chakra-ui/layout';
import React from 'react';

const PfxVal = ({
  pfx,
  val,
  sfx,
  onClick = () => {},
}: {
  pfx: string;
  val: string | number | undefined;
  sfx?: string;
  onClick?: () => void;
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
    <Flex align="center" onClick={onClick}>
      <Text
        minW="6"
        color="gray.400"
        textTransform="uppercase"
        fontSize="xs"
        fontWeight="medium">
        {pfx}
      </Text>
      <Text ml={1} fontSize="sm">
        {Val}
      </Text>
      {val && sfx && (
        <Text fontSize="sm" ml={1}>
          {sfx}
        </Text>
      )}
    </Flex>
  );
};

export default PfxVal;
