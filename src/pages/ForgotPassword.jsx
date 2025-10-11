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

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgotPassword = () => {
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
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSuccessMessage("");
    setFailedMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage(`Password reset link has been sent to ${data.email}`);
      reset();
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setFailedMessage("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="my-6 md:my-0">
      <div className="flex">
        <img src={ForgotImg} alt="coffe-img" className="hidden md:block" />
        <div className="bg-white w-full max-w-[780px] min-h-[821px] my-10 mx-10 md:mt-60">
       <AuthAlert type="success" message={successMessage}/>
       <AuthAlert type="error" message={failedMessage}/>

          <div>
            <img src={CoffeLogo} alt="coffe-img" />
          </div>
          <h1 className="text-[#8E6447] text-2xl font-semibold mt-6">
            Fill out the form correctly
          </h1>
          <p className="text-[#4F5665] text-base font-normal my-6">
            We will send new password to your email
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              type="email"
              name="email"
              label="Email"
              placeholder="Enter Your Email"
              register={register}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
            />

            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
