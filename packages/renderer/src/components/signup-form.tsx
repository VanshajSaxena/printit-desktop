import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import {
  IconBrandGoogleFilled,
  IconCheck,
  IconX,
  IconLoader2,
} from "@tabler/icons-react";
import { client } from "@/api/client";

type SignupFormProps = React.ComponentProps<"form"> & {
  switchToLogin: () => void;
};

export function SignupForm({
  className,
  switchToLogin,
  ...props
}: SignupFormProps) {
  const register = useAuthStore((store) => store.register);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedUsername, setDebouncedUsername] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(formData.username);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [formData.username]);

  const { data: availability, isFetching: isCheckingUsername } =
    client.useQuery(
      "get",
      "/api/v1/vendors/username",
      {
        params: { query: { username: debouncedUsername } },
      },
      {
        enabled: debouncedUsername.length >= 3,
      },
    );

  const isUsernameAvailable = availability?.available;

  const passwordCriteria = {
    hasLength: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[\W_]/.test(formData.password),
  };

  const isPasswordStrong = Object.values(passwordCriteria).every(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isUsernameAvailable === false) {
      setError("Please choose an available username.");
      return;
    }

    if (!isPasswordStrong) {
      setError(
        "Please ensure your password meets all the strong security requirements.",
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await register(
        formData.firstName,
        formData.lastName,
        formData.username,
        formData.email,
        formData.password,
      );
    } catch (err) {
      setError("Failed to create account. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to get started
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive border-destructive/20 rounded-md border p-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <div className="relative">
            <Input
              id="username"
              type="text"
              placeholder="johndoe123"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={cn(
                "pr-10",
                isUsernameAvailable === false &&
                  "border-destructive focus-visible:ring-destructive",
                isUsernameAvailable === true &&
                  "border-green-500 focus-visible:ring-green-500",
              )}
            />

            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              {isCheckingUsername && (
                <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {!isCheckingUsername && isUsernameAvailable === true && (
                <IconCheck className="h-4 w-4 text-green-500" />
              )}
              {!isCheckingUsername && isUsernameAvailable === false && (
                <IconX className="text-destructive h-4 w-4" />
              )}
            </div>
          </div>
          <FieldDescription
            className={cn(isUsernameAvailable === false && "text-destructive")}
          >
            {isUsernameAvailable === false
              ? "This username is already taken."
              : "Choose a unique handle."}
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="mail@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          {formData.password && (
            <div className="mt-2 space-y-1 text-xs">
              <p className="mb-1 font-medium text-muted-foreground">
                Password must contain:
              </p>
              <ul className="space-y-1">
                <li
                  className={cn(
                    "flex items-center gap-1",
                    passwordCriteria.hasLength
                      ? "text-green-500"
                      : "text-muted-foreground",
                  )}
                >
                  {passwordCriteria.hasLength ? (
                    <IconCheck className="h-3 w-3" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-current" />
                  )}
                  At least 8 characters
                </li>
                <li
                  className={cn(
                    "flex items-center gap-1",
                    passwordCriteria.hasUpper
                      ? "text-green-500"
                      : "text-muted-foreground",
                  )}
                >
                  {passwordCriteria.hasUpper ? (
                    <IconCheck className="h-3 w-3" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-current" />
                  )}
                  One uppercase letter
                </li>
                <li
                  className={cn(
                    "flex items-center gap-1",
                    passwordCriteria.hasLower
                      ? "text-green-500"
                      : "text-muted-foreground",
                  )}
                >
                  {passwordCriteria.hasLower ? (
                    <IconCheck className="h-3 w-3" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-current" />
                  )}
                  One lowercase letter
                </li>
                <li
                  className={cn(
                    "flex items-center gap-1",
                    passwordCriteria.hasNumber
                      ? "text-green-500"
                      : "text-muted-foreground",
                  )}
                >
                  {passwordCriteria.hasNumber ? (
                    <IconCheck className="h-3 w-3" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-current" />
                  )}
                  One number
                </li>
                <li
                  className={cn(
                    "flex items-center gap-1",
                    passwordCriteria.hasSpecial
                      ? "text-green-500"
                      : "text-muted-foreground",
                  )}
                >
                  {passwordCriteria.hasSpecial ? (
                    <IconCheck className="h-3 w-3" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-current" />
                  )}
                  One special character
                </li>
              </ul>
            </div>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          <FieldDescription
            className={
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
                ? "text-destructive"
                : ""
            }
          >
            {formData.confirmPassword &&
            formData.password !== formData.confirmPassword
              ? "Passwords do not match."
              : "Please confirm your password."}
          </FieldDescription>
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={
              isLoading ||
              isCheckingUsername ||
              isUsernameAvailable === false ||
              (formData.password.length > 0 && !isPasswordStrong)
            }
            className="w-full"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <div className="grid gap-2">
            <Button
              variant="outline"
              type="button"
              className="w-full"
              disabled={isLoading}
            >
              <IconBrandGoogleFilled className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>
          </div>
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                switchToLogin();
              }}
              className="font-medium text-secondary-content underline hover:text-secondary-content/80"
            >
              Sign in
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
