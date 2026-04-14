export interface ButtonProps extends React.ComponentProps<"button"> {
  text?: string;
  size?: "md" | "lg";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
