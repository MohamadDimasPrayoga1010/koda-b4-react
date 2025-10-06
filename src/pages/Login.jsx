import CoffeLogo from "/images/CoffeLogo.png";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginSchema } from "../utils/loginSchema";
import { loginUser } from "../utils/localStorange";
import { Mail } from "lucide-react";
import PasswordIcon from "/images/Password.svg";
import GoogleIcon from "/images/google.svg";
import FacebookIcon from "/images/facebook.svg";
import LoginImg from "/images/LoginImg.png";
import { X, Check } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = loginUser(data.email, data.password);

      if (result.success) {
        console.log("Logged in user:", result.user);
        setSuccessMessage(result.message);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        if (result.message.includes("Email")) {
          setError("email", {
            type: "manual",
            message: result.message,
          });
        } else if (result.message.includes("password")) {
          setError("password", {
            type: "manual",
            message: result.message,
          });
        } else {
          setErrorMessage(result.message);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setErrorMessage("");
    setSuccessMessage("");
    setErrorMessage(`${provider} login is not implemented yet.`);
  };

  return (
    <main className="my-6 md:my-0">
      <div className="flex">
        <img src={LoginImg} alt="coffe-img" className="hidden md:block" />
        <div className="bg-white w-full max-w-[780px] min-h-[821px] my-10 mx-10 md:mt-60">
          {successMessage && (
            <div className="mb-4 p-4 rounded-lg text-green-700 bg-green-50 border border-green-200 flex items-start gap-3">
              <Check className="text-green-900"/>
              <div>
                <p className="font-medium">{successMessage}</p>
                {isLoading && (
                  <p className="text-sm text-green-600 mt-1">
                    Redirecting to dashboard...
                  </p>
                )}
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-4 rounded-lg text-red-700 bg-red-50 border border-red-200 flex items-start gap-3">
              <X className="text-red-900" />
              <div>
                <p className="font-medium">{errorMessage}</p>
              </div>
            </div>
          )}

          <div>
            <img src={CoffeLogo} alt="coffe-img" />
          </div>
          <h1 className="text-[#8E6447] text-2xl font-semibold mt-6">Login</h1>
          <p className="text-[#4F5665] text-base font-normal my-6">
            Fill out the form correctly
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

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-600 transition"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center mt-5">
            <p className="text-gray-600 text-sm">
              Not Have An Account?
              <Link
                to="/register"
                className="text-orange-500 hover:text-orange-600 font-medium transition"
              >
                Register
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
              <img src={FacebookIcon} alt="facebook-icon" />
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

export default Login;
