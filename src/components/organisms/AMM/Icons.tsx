import { Icon, useToken } from '@chakra-ui/react';

export const SwapIcon = ({ color }: { color?: string }) => {
  const [fill] = useToken('colors', [color || 'black']);

  return (
    <Icon viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C18.623 0 24 5.377 24 12C24 18.623 18.623 24 12 24C5.377 24 0 18.623 0 12C0 5.377 5.377 0 12 0ZM12 2C17.519 2 22 6.481 22 12C22 17.519 17.519 22 12 22C6.481 22 2 17.519 2 12C2 6.481 6.481 2 12 2ZM14 14V11L19 15L14 19V16H5V14H14ZM10 8V5L5 9L10 13V10H19V8H10Z"
        fill={fill}
      />
    </Icon>
  );
};

export const DepositIcon = ({ color }: { color?: string }) => {
  const [fill] = useToken('colors', [color || 'black']);

  return (
    <Icon viewBox="0 0 24 24">
      <mask
        id="mask0"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24">
        <rect
          width="24"
          height="24"
          transform="translate(24 24) rotate(-180)"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0)">
        <path
          d="M14 6.37351L19 6.37351L12 14.0644L5 6.37351L10 6.37351L10 -3.24005L14 -3.24005L14 6.37351Z"
          fill={fill}
        />
        <path
          d="M18.213 12.1417L17 13.6789C19.984 15.3439 22 18.4424 22 21.9917C22 27.2926 17.514 31.6053 12 31.6053C6.486 31.6053 2 27.2926 2 21.9917C2 18.4424 4.016 15.3439 7 13.6789L5.787 12.1417C2.322 14.1634 0 17.8108 0 21.9917C0 28.3626 5.373 33.528 12 33.528C18.627 33.528 24 28.3626 24 21.9917C24 17.8108 21.678 14.1634 18.213 12.1417Z"
          fill={fill}
        />
      </g>
    </Icon>
  );
};

export const WithdrawIcon = ({ color }: { color?: string }) => {
  const [fill] = useToken('colors', [color || 'black']);

  return (
    <Icon viewBox="0 0 24 24">
      <mask
        id="mask0"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24">
        <rect width="24" height="24" fill="white" />
      </mask>
      <g mask="url(#mask0)">
        <path
          d="M18.213 12.1417L17 13.6789C19.984 15.344 22 18.4425 22 21.9918C22 27.2927 17.514 31.6053 12 31.6053C6.486 31.6053 2 27.2927 2 21.9918C2 18.4425 4.016 15.344 7 13.6789L5.787 12.1417C2.322 14.1635 0 17.8108 0 21.9918C0 28.3627 5.373 33.528 12 33.528C18.627 33.528 24 28.3627 24 21.9918C24 17.8108 21.678 14.1635 18.213 12.1417Z"
          fill={fill}
        />
        <path
          d="M10 8.29622L5 8.29622L12 0.605378L19 8.29622L14 8.29622L14 15.9871L10 15.9871L10 8.29622Z"
          fill={fill}
        />
      </g>
    </Icon>
  );
};
