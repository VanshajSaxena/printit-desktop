export type ButtonSizes = 'md' | 'lg';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  size?: ButtonSizes;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
