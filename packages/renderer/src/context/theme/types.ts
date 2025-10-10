export interface ThemeColors {
  fg: {
    primary: string;
    secondary: string;
    tertiary: string;
    status: {
      success: string;
      queued: string;
      waiting: string;
    };
  };
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    status: {
      success: string;
      queued: string;
      waiting: string;
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
  colors: ThemeColors;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}
