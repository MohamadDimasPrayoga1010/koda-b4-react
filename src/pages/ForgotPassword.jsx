import CoffeLogo from "/images/CoffeLogo.png";
import InputField from "../components/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Mail } from "lucide-react";
import Button from "../components/Button";
import ForgotImg from "/images/ForgotImg.png";
import AuthAlert from "../components/AuthAlert";

const emailSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
});


const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const ForgotPassword = () => {
  const [otp, setOtp] = useState("email"); 
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failedMessage, setFailedMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(otp === "email" ? emailSchema : otpSchema),
  });

  const handleEmailSubmit = async (data) => {
    setIsLoading(true);
    setSuccessMessage("");
    setFailedMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage(result.message || "OTP has been sent to your email");
        setEmail(data.email); 
        setOtp("otp");
        reset();
      } else {
        setFailedMessage(result.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      setFailedMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (data) => {
    setIsLoading(true);
    setSuccessMessage("");
    setFailedMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/reset-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: data.otp,
          password: data.password,
          email: email, 
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage(result.message || "Password has been reset successfully");
        reset();
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setFailedMessage(result.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error:", error);
      setFailedMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="my-6 md:my-0">
      <div className="flex">
        <img src={ForgotImg} alt="coffe-img" className="hidden md:block" />
        <div className="bg-white w-full max-w-[780px] min-h-[821px] my-10 mx-10 md:mt-60">
          <AuthAlert type="success" message={successMessage} />
          <AuthAlert type="error" message={failedMessage} />

          <div>
            <img src={CoffeLogo} alt="coffe-logo" />
          </div>
          <h1 className="text-[#8E6447] text-2xl font-semibold mt-6">
            Fill out the form correctly
          </h1>
          <p className="text-[#4F5665] text-base font-normal my-6">
            {otp === "email"
              ? "We will send an OTP to your email"
              : "Enter OTP and your new password"}
          </p>

          <form
            onSubmit={handleSubmit(otp === "email" ? handleEmailSubmit : handleOtpSubmit)}
            className="space-y-4"
          >
            {otp === "email" && (
              <InputField
                type="email"
                name="email"
                label="Email"
                placeholder="Enter Your Email"
                register={register}
                error={errors.email}
                icon={<Mail className="w-5 h-5" />}
              />
            )}

            {otp === "otp" && (
              <>
                <InputField
                  type="text"
                  name="otp"
                  label="OTP"
                  placeholder="Enter OTP"
                  register={register}
                  error={errors.otp}
                />
                <InputField
                  type="password"
                  name="password"
                  label="New Password"
                  placeholder="••••••••"
                  register={register}
                  error={errors.password}
                />
                <InputField
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="••••••••"
                  register={register}
                  error={errors.confirmPassword}
                />
              </>
            )}

            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
