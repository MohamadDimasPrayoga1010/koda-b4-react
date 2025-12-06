import CoffeLogo from "/images/logoweb.png";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginSchema } from "../utils/loginSchema";
import { Mail } from "lucide-react";
import PasswordIcon from "/images/Password.svg";
import GoogleIcon from "/images/google.svg";
import FacebookIcon from "/images/facebook.svg";
import LoginImg from "/images/cofeederlog.jpeg";
import AuthAlert from "../components/AuthAlert";
import { useDispatch } from "react-redux";
import { login as loginAction, setLoading } from "../redux/reducer/auth";
import { apiRequest } from "../utils/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (location.state?.message) {
      setAlert({ type: "warning", message: location.state.message });
      navigate(location.pathname, { replace: true, state: {} });
    }
    else if (location.state?.successMessage) {
      setAlert({ type: "success", message: location.state.successMessage });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    
    try {
      const result = await apiRequest("/auth/login", "POST", {
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        dispatch(loginAction(result.data));

        setAlert({ type: "success", message: "Login berhasil!" });

        setTimeout(() => {
          if (result.data.role === "admin") {
            navigate("/dashboard");
            console.log("LOGIN RESULT:", result);
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        if (result.message.includes("Email")) {
          setFormError("email", { type: "manual", message: result.message });
        } else if (result.message.includes("password")) {
          setFormError("password", { type: "manual", message: result.message });
        } else {
          setAlert({ type: "error", message: result.message });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setAlert({ type: "error", message: "Terjadi kesalahan server!" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSocialLogin = (provider) => {
    setAlert({ type: "error", message: `${provider} login belum tersedia.` });
  };

  return (
    <main className="my-6 md:my-0">
      <div className="flex">
        <img src={LoginImg} alt="coffe-img" className="hidden md:block" />

        <div className="bg-white w-full max-w-[780px] min-h-[821px] my-10 mx-10 md:mt-60">
          {alert.message && (
            <AuthAlert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ type: "", message: "" })}
            />
          )}

          <div>
            <img src={CoffeLogo} alt="coffe-logo" className="w-16 h-16"/>
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

            <Button type="submit" className="w-full mt-6">
              Login
            </Button>
          </form>

          <div className="text-center mt-5">
            <p className="text-gray-600 text-sm">
              Not Have An Account?{" "}
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