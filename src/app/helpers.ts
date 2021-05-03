import { FormEvent } from "react";

export const setField = (setter: (val: string) => void) => {
  return (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setter(e.currentTarget.value);
  }
}

