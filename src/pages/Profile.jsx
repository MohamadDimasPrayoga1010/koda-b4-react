import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Phone, Lock, MapPin, CircleUser } from "lucide-react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthAlert from "../components/AuthAlert";
import { apiRequest } from "../utils/api";
import { setUser } from "../redux/reducer/auth";

const Profile = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [alert, setAlert] = useState({ type: "success", message: "" });

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
          if (data.image) setAvatar(data.image);
          dispatch(setUser({
            id: data.id,
            fullname: data.fullname,
            email: data.email,
            phone: data.phone,
            address: data.address,
            avatar: data.image,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            token,
          }));
        } else {
          setAlert({ type: "error", message: res.message });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setAlert({ type: "error", message: "Failed to fetch profile" });
      }
    };

    fetchProfile();
  }, [token, reset, dispatch]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("fullname", formData.fullname);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone || "");
      payload.append("address", formData.address || "");
      if (fileInputRef.current.files[0]) {
        payload.append("image", fileInputRef.current.files[0]);
      }

      const res = await apiRequest("/profile", "PATCH", payload, token, true);
      console.log(res)
      if (res.success) {
        const data = res.data;
        dispatch(setUser({
          id: data.id,
          fullname: data.fullname,
          email: data.email,
          phone: data.phone,
          address: data.address,
          avatar: data.image,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          token,
        }));
  
        reset({
          fullname: data.fullname || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
        if (data.image) setAvatar(data.image);
        setAlert({ type: "success", message: "Profile updated successfully!" });
      } else {
        setAlert({ type: "error", message: res.message || "Failed to update profile" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "An error occurred while updating profile" });
    }
  };

  return (
    <main className="my-30 md:mx-26">
      <h1 className="text-5xl text-[#0B0909]">Profile</h1>

      {alert.message && <AuthAlert type={alert.type} message={alert.message} />}

      <section className="my-7 flex gap-3">
        <div className="border border-[#E8E8E8] w-[280px] h-[343px] p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-[#0B132A]">{user?.fullname || "User"}</p>
              <p className="text-sm text-gray-500">{user?.email || ""}</p>
            </div>
            <div className="w-25 h-25 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-16 h-16 object-cover rounded-full" />
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
                type="password"
                name="password"
                placeholder="••••••••••"
                icon={<Lock className="w-5 h-5" />}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                register={register}
                error={errors.password}
              />
              <button
                type="button"
                className="absolute right-0 top-0 text-sm text-orange-500 font-medium hover:text-orange-600"
              >
                Set New Password?
              </button>
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
