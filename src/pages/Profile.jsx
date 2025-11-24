import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Phone, Lock, MapPin, CircleUser } from "lucide-react";
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
    <main className="my-30 md:mx-26">
      <Loading show={loading} text="Updating profile..." fullScreen={true} />

      <h1 className="text-5xl text-[#0B0909]">Profile</h1>

      {alert.message && <AuthAlert type={alert.type} message={alert.message} />}

      <section className="my-7 flex gap-3">
        <div className="border border-[#E8E8E8] w-[280px] h-[343px] p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-[#0B132A]">
                {user?.fullname || "User"}
              </p>
              <p className="text-sm text-gray-500">{user?.email || ""}</p>
            </div>

            <div className="w-25 h-25 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-16 h-16 object-cover rounded-full"
                />
              ) : (
                <CircleUser className="w-16 h-16 text-gray-400" />
              )}
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <Button className="w-full" onClick={handleButtonClick}>
                Upload New Photo
              </Button>
            </div>

            <p className="text-base text-[#4F5665] text-center">
              Since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>

        <div className="border border-[#E8E8E8] w-[780px]">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full p-6 space-y-4">
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
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition mt-6"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Profile;
