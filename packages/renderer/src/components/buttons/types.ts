export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  text?: string;
  size?: "md" | "lg";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
