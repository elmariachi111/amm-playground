import hslRgb from 'hsl-rgb';
import hslTriad from 'hsl-triad';
import { FormEvent } from 'react';
import rgbHex from 'rgb-hex';
import stringHash from 'string-hash';

const encoder = new TextEncoder();
const navigatorLanguage = navigator.language;

export const setField = (setter: (val: string) => void) => {
  return (e: FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    setter(e.currentTarget.value);
  };
};

export const setNumericalField = (setter: (val: number | undefined) => void) => {
  return (e: any) => {
    e.preventDefault();
    const val = e.target.valueAsNumber;
    setter(val);
  };
};

export const buf2hex = (buffer: ArrayBuffer): string => {
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('');
};

export const sha256hash = async (value: string): Promise<string> => {
  const buffer = await window.crypto.subtle.digest('SHA-256', encoder.encode(value));
  return buf2hex(buffer);
};

/**
 * shamelessly copied from: https://github.com/varld/gradient-avatar/blob/master/index.js
 * @param str
 * @returns
 */
export const colorRange = (str: string): string[] => {
  const hash = stringHash(str);
  const colors = hslTriad(hash % 360, 1, 0.5);
  const color1 = hslRgb(colors[0][0], colors[0][1], colors[0][2]);
  const color2 = hslRgb(colors[1][0], colors[1][1], colors[1][2]);
  const color1str = `#${rgbHex(color1[0], color1[1], color1[2])}`;
  const color2str = `#${rgbHex(color2[0], color2[1], color2[2])}`;
  return [color1str, color2str];
};

export const currency = (val: number, fiat: boolean = false): string => {
  return fiat
    ? val.toLocaleString(navigatorLanguage, {
        style: 'currency',
        useGrouping: true,
        currency: 'USD',
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      })
    : val.toLocaleString('en-GB', {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      });
};
