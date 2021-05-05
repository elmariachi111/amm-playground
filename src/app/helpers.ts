import { FormEvent } from "react";
const encoder = new TextEncoder();

export const setField = (setter: (val: string) => void) => {
  return (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setter(e.currentTarget.value);
  };
};

export const buf2hex = (buffer: ArrayBuffer): string => {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
};

export const sha256hash = async (value: string): Promise<string> => {
  const buffer = await window.crypto.subtle.digest(
    "SHA-256",
    encoder.encode(value)
  );
  return buf2hex(buffer);
};
