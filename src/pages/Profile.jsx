import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Phone, Lock, MapPin, CircleUser, Camera, Calendar } from "lucide-react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthAlert from "../components/AuthAlert";
import Loading from "../components/Loading";
import { apiRequest } from "../utils/api";
import { setUser } from "../redux/reducer/auth";

const Profile = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [alert, setAlert] = useState({ type: "success", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;

        const res = await apiRequest("/profile", "GET", null, token);

        if (res.success) {
          const data = res.data;

          reset({
            fullname: data.fullname || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });

          setAvatarPreview(data.image || null);

          dispatch(
            setUser({
              ...data,
              avatar: data.image,
              token,
            })
          );
        } else {
          setAlert({ type: "error", message: res.message });
        }
      } catch (err) {
        setAlert({ type: "error", message: "Failed to fetch profile" });
      }
    };

    fetchProfile();
  }, [token, reset, dispatch]);

  const handleButtonClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true); 

      const payload = new FormData();

      payload.append("fullname", formData.fullname);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone || "");
      payload.append("address", formData.address || "");

      if (formData.password && formData.password.trim() !== "") {
        payload.append("password", formData.password);
      }

      if (fileInputRef.current.files[0]) {
        payload.append("image", fileInputRef.current.files[0]);
      }

      const res = await apiRequest("/profile", "PATCH", payload, token, true);

      if (res.success) {
        const data = res.data;

        dispatch(
          setUser({
            ...data,
            avatar: data.image,
            token,
          })
        );

        reset({
          fullname: data.fullname || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });

        setAvatarPreview(data.image || null);

        setAlert({ type: "success", message: "Profile updated successfully!" });
      } else {
        setAlert({ type: "error", message: res.message || "Failed to update profile" });
      }
    } catch (err) {
      setAlert({ type: "error", message: "An error occurred while updating profile" });
    } finally {
      setLoading(false); 
    }
  };

  return (
    <main className="my-30 md:mx-26 px-4 md:px-0">
      <Loading show={loading} text="Updating profile..." fullScreen={true} />
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A0F0A] mb-2">Profile</h1>
        <div className="h-1.5 w-20 bg-gradient-to-r from-[#D4A574] to-transparent rounded-full"></div>
      </div>

      {alert.message && <AuthAlert type={alert.type} message={alert.message} />}

      <section className="my-7 flex flex-col lg:flex-row gap-6">
        <div className="bg-white border-2 border-[#D4A574]/20 rounded-2xl shadow-xl w-full lg:w-[320px] p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <p className="text-xl font-bold text-[#1A0F0A] mb-1">
                {user?.fullname || "User"}
              </p>
              <p className="text-sm text-[#8B7355]">{user?.email || ""}</p>
            </div>

            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#F5E6D3] to-[#D4A574]/30 flex items-center justify-center overflow-hidden border-4 border-[#D4A574] shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CircleUser className="w-20 h-20 text-[#8B6F47]" />
                )}
              </div>
              
              <div className="absolute bottom-0 right-0 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300" onClick={handleButtonClick}>
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="w-full">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <Button 
                className="w-full bg-gradient-to-r from-[#D4A574] to-[#8B6F47] hover:from-[#8B6F47] hover:to-[#D4A574] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" 
                onClick={handleButtonClick}
              >
                Upload New Photo
              </Button>
            </div>

            <div className="w-full pt-4 border-t border-[#D4A574]/20">
              <div className="flex items-center justify-center gap-2 text-[#6B5744]">
                <Calendar className="w-4 h-4 text-[#8B6F47]" />
                <p className="text-sm font-medium">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#D4A574]/20 rounded-2xl shadow-xl flex-1 hover:shadow-2xl transition-all duration-300">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full p-6 md:p-8 space-y-5">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#1A0F0A] mb-2">Personal Information</h2>
              <p className="text-sm text-[#8B7355]">Update your profile details below</p>
            </div>

            <InputField
              label="Full Name"
              type="text"
              name="fullname"
              placeholder="Full Name"
              register={register}
              error={errors.fullname}
              icon={<User className="w-5 h-5" />}
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Email"
              register={register}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
            />

            <InputField
              label="Phone"
              type="tel"
              name="phone"
              placeholder="(+62) 0140 1234"
              register={register}
              error={errors.phone}
              icon={<Phone className="w-5 h-5" />}
            />

            <div className="relative">
              <InputField
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••"
                register={register}
                error={errors.password}
                icon={<Lock className="w-5 h-5" />}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            <InputField
              label="Address"
              type="text"
              name="address"
              placeholder="Address"
              register={register}
              error={errors.address}
              icon={<MapPin className="w-5 h-5" />}
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4A574] to-[#8B6F47] hover:from-[#8B6F47] hover:to-[#D4A574] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mt-8"
            >
              Save Changes
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Profile;