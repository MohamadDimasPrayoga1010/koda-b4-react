import * as yup from "yup";

export const schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: yup
    .string()
    .required("Email is required")
    .email("Email is invalid")
    .lowercase()
    .trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
