import { type Theme } from './types';

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    fg: {
      primary: '#FFFFFF',
      secondary: '#BCBCBC',
      tertiary: '#999999',
      status: {
        success: '#22C55E',
        queued: '#8A75FF',
        waiting: '#D4D4D4',
      },
    },
    bg: {
      primary: '#090909',
      secondary: '#101011',
      tertiary: '#1F1F1F',
      status: {
        success: '#1C2B1C',
        queued: '#3424BF',
        waiting: '#404040',
      },
    },
    border: {
      default: '#2E2E2E',
    },
    control: {
      border: '#333333',
    },
    chart: {
      graphLines: '#1A1A1A',
      legends: '#747474',
    },
    shadow: {
      default: '#FFFFFF',
    },
    overlay: {
      select: '#FFFFFF',
    },
  },
};

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    fg: {
      primary: '#000000',
      secondary: '#424242',
      tertiary: '#666666',
      status: {
        success: '#122112',
        queued: '#816BFF',
        waiting: '#2B2B2B',
      },
    },
    bg: {
      primary: '#F5F5F5',
      secondary: '#E5E5E5',
      tertiary: '#D6D6D6',
      status: {
        success: '#94EB94', // 80 % alpha
        queued: '#BEB6ED',
        waiting: '#BFBFBF',
      },
    },
    border: {
      default: '#D1D1D1',
    },
    control: {
      border: '#CCCCCC',
    },
    chart: {
      graphLines: '#D9D9D9',
      legends: '#8C8C8C',
    },
    shadow: {
      default: '#000000', // 10% alpha
    },
    overlay: {
      select: '#000000', // 10% alpha
    },
  },
};
