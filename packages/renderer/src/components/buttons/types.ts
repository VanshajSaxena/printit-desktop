export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  size?: "md" | "lg";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
