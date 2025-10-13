import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, Lock, MapPin, CircleUser } from "lucide-react";
import InputField from "../components/InputField";
import Button from "../components/Button";

const Profile = () => {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
      fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log("File dipilih:", file.name);
      }
    };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <main className="my-30 md:mx-26">
      <h1 className="text-5xl text-[#0B0909]">Profile</h1>
      <section className="my-7 flex gap-3">
        <div className="border border-[#E8E8E8] w-[280px] h-[343px] p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-[#0B132A]">Yoga</p>
              <p className="text-sm text-gray-500">Yoga@gmail.com</p>
            </div>
            <div className="w-25 h-25 rounded-full bg-gray-100 flex items-center justify-center">
              <CircleUser className="w-16 h-16 text-gray-400" />
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
              Since 20 January 2022
            </p>
          </div>
        </div>
        <div className="border border-[#E8E8E8] w-[780px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full p-6 space-y-4"
          >
            <InputField
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="Yoga"
              icon={<User className="w-5 h-5" />}
              register={register}
              error={errors.fullName}
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Yoga@gmail.com"
              icon={<Mail className="w-5 h-5" />}
              register={register}
              error={errors.email}
            />

            <InputField
              label="Phone"
              type="tel"
              name="phone"
              placeholder="(+62) 0140 1234"
              icon={<Phone className="w-5 h-5" />}
              register={register}
              error={errors.phone}
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
              placeholder="Ship Bandung Indah"
              icon={<MapPin className="w-5 h-5" />}
              register={register}
              error={errors.address}
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
