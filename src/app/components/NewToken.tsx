import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Heading } from "@chakra-ui/layout";
import React, { FormEvent, useState } from "react";

import { Token } from "../../lib/Token";
import { setField } from "../helpers";

export default function NewToken({ onNew }: { onNew: (t: Token) => void }) {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const token = new Token(symbol, name);
    onNew(token);

    setName("");
    setSymbol("");
  };

  return (
    <Box>
      <Heading size="md">Create a token</Heading>
      <form onSubmit={onSubmit}>
        <FormControl id="symbol">
          <FormLabel>Symbol</FormLabel>
          <Input type="text" name="symbol" onChange={setField(setSymbol)} />
        </FormControl>
        <FormControl id="name">
          <FormLabel>Name</FormLabel>

          <Input type="text" name="name" onChange={setField(setName)} />
        </FormControl>
        <Button mt={3} type="submit" colorScheme="linkedin">
          Create {symbol}
        </Button>
      </form>
    </Box>
  );
}
