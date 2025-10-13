type ButtonState = 'default';

type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state?: ButtonState;
  size?: ButtonSize;
  icon?: React.ReactNode;
  childrer?: React.ReactNode;
}
