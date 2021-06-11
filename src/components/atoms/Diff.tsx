import Icon from '@chakra-ui/icon';
import { Text } from '@chakra-ui/layout';
import React from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

type DiffType = 'abs' | 'rel';

const Diff = ({
  cur,
  last,
  type = 'abs',
}: {
  cur: number;
  last: number | undefined;
  type: DiffType;
}) => {
  if (!last) return <Text>-</Text>;

  const abs = cur - last;
  const change = (cur * 100) / last;
  const rel = change > 100 ? change - 100 : 100 - change;
  const color = abs > 0 ? 'green.300' : 'red.500';
  const val = type === 'abs' ? abs.toFixed(2) : rel.toFixed(2);
  return (
    <Text color={color} fontWeight="medium" whiteSpace="nowrap" d="inline">
      {val} {type == 'rel' ? '%' : ''}
      {<Icon as={abs > 0 ? IoMdArrowDropup : IoMdArrowDropdown} />}
    </Text>
  );
};

export default Diff;
