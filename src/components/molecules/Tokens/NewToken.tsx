import { Button } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi';

import { Token } from '../../../lib/Token';
import NewTokenForm from './NewTokenForm';

export default function NewToken({ onNew }: { onNew: (t: Token) => void }) {
  const [form, setForm] = useState<boolean>(false);

  const onNewToken = (token: Token) => {
    onNew(token);
    setForm(false);
  };
  return form ? (
    <NewTokenForm onNew={onNewToken} />
  ) : (
    <Button
      mt={5}
      colorScheme="green"
      isFullWidth
      onClick={() => setForm(true)}
      leftIcon={<Icon as={HiPlus} w={6} h={6} />}>
      New Token
    </Button>
  );
}
