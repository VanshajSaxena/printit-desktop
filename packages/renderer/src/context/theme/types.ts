export interface ThemeColors {
  fg: {
    primary: string;
    secondary: string;
    tertiary: string;
    status: {
      success: string;
      waiting: string;
      queued: string;
    };
  };
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    status: {
      success: string;
      waiting: string;
      queued: string;
    };
  };
  border: {
    default: string;
  };
  control: {
    border: string;
  };
  chart: {
    graphLines: string;
    legends: string;
  };
  shadow: {
    default: string;
  };
  overlay: {
    select: string;
  };
}

export interface Theme {
  name: 'light' | 'dark';
  theme: ThemeColors;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: () => void;
}
