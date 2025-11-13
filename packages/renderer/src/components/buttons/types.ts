export type ButtonSizes = 'md' | 'lg';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  size?: ButtonSizes;
  varient?: 'default' | 'ghost';
  icon?: React.ReactNode;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export interface KebabButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state: 'default' | 'hover';
}
