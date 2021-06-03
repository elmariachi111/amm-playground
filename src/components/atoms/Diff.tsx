import { Text } from '@chakra-ui/layout';
import React from 'react';

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
    <Text color={color} fontWeight="medium">
      {val} {type == 'rel' ? '%' : ''}
    </Text>
  );
};

export default Diff;
