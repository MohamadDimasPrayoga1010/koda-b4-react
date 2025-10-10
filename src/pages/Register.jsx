import Rectangle from "/images/Rectangle.png";
import CoffeLogo from "/images/CoffeLogo.png";
import InputField from "../components/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { schema } from "../utils/schema";
import { Mail, User } from "lucide-react";
import PasswordIcon from "/images/Password.svg";
import GoogleIcon from "/images/google.svg";
import FacebookIcon from "/images/facebook.svg";
import Button from "../components/Button";
import AuthContext  from "../context/AuthContext"; 

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failedMessage, setFailedMessage] = useState("");
  const navigate = useNavigate();

  const { register: registerUser } = useContext(AuthContext); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSuccessMessage("");
    setFailedMessage("");

    try {
      const result = registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        setSuccessMessage("Registration successful! Please login");
        reset();
        console.log("Registered user:", result.user);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
       
      } else {
        setError("email", {
          type: "manual",
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setFailedMessage("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setSuccessMessage("");
    setFailedMessage("");
    setFailedMessage(`${provider} login is not implemented yet.`);
  };

  return (
    <main className="my-6 md:my-0">
      <div className="flex">
        <img src={Rectangle} alt="coffe-img" className="hidden md:block" />
        <div className="bg-white w-full max-w-[780px] min-h-[821px] mx-10 md:mt-[61px]">
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg text-green-700 bg-green-100 border border-green-300">
              {successMessage}
            </div>
          )}
          {failedMessage && (
            <div className="mb-4 p-3 rounded-lg text-red-700 bg-red-100 border border-red-300">
              {failedMessage}
            </div>
          )}
          <div>
            <img src={CoffeLogo} alt="coffe-img" />
          </div>
          <h1 className="text-[#8E6447] text-2xl font-semibold mt-6">
            Register
          </h1>
          <p className="text-[#4F5665] text-base font-normal my-6">
            Fill out the form correctly
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              type="text"
              name="fullName"
              label="Full Name"
              placeholder="Enter Your Full Name"
              register={register}
              error={errors.fullName}
              icon={<User className="w-5 h-5" />}
            />

            <InputField
              type="email"
              name="email"
              label="Email"
              placeholder="Enter Your Email"
              register={register}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
            />

            <InputField
              type="password"
              name="password"
              label="Password"
              placeholder="Enter Your Password"
              register={register}
              error={errors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              icon={<img src={PasswordIcon} alt="password-icon" />}
            />

            <InputField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Enter Your Password Again"
              register={register}
              error={errors.confirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              icon={<img src={PasswordIcon} alt="password-icon" />}
            />

            <Button className="w-full">
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="text-center mt-5">
            <p className="text-gray-600 text-sm">
              Have An Account?{" "}
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-600 font-medium transition"
              >
                Login
              </Link>
            </p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              onClick={() => handleSocialLogin("Facebook")}
            >
              <img src={FacebookIcon} alt="facebox-icon" />
              <span className="text-gray-700 font-medium text-sm">
                Facebook
              </span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              onClick={() => handleSocialLogin("Google")}
            >
              <img src={GoogleIcon} alt="google-icon" />
              <span className="text-gray-700 font-medium text-sm">Google</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
