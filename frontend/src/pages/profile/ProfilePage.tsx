import { useEffect, useState, type FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../lib/hooks/useAuth";

import { motion } from "framer-motion";
import { useUpdateProfile } from "../../models/auth/useUpdateProfile";

export const inputClass =
  "w-full p-3 rounded-xl bg-white border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

const ProfilePage = () => {
  const { handleSetToken } = useAuth();

  const { user } = useAuth();

  const [personalData, setPersonalData] = useState({
    age: user?.info.age || "",
    fullName: user?.info.fullName || "",
    educationDegree: user?.info.educationDegree || "",
  });

  const [success, setSucces] = useState(false);

  const { mutate } = useUpdateProfile();

  const handleLogout = () => {
    handleSetToken(undefined);
  };

  const reset = () => {
    setPersonalData({
      age: user?.info.age || "",
      fullName: user?.info.fullName || "",
      educationDegree: user?.info.educationDegree || "",
    });
  };

  useEffect(() => {
    reset();
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      mutate(
        {
          age: Number(personalData.age),
          fullName: personalData.fullName,
          educationDegree: personalData.educationDegree,
          id: user?.id || "",
        },
        {
          onSuccess: (data) => {
            if (data.token) {
              localStorage.setItem("accessToken", data.token);
              handleSetToken(data.token);
              setSucces(true);
              setTimeout(() => {
                setSucces(false);
              }, 4000);
            }
          },

          onError: (error) => console.error("Error", error),
        }
      );
    } catch (error) {}
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-semibold text-gray-800">
            Profile
          </h1>

          <p className="mb-6 text-center text-gray-600">
            This is your profile page
          </p>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="w-full max-w-md"
            >
              <div className="bg-green-500/80 rounded-sm text-white px-3 py-2 mb-4 text-center font-semibold">
                <p>🎉🎉 Profile successfully updated ! 🎊🎊</p>
              </div>
            </motion.div>
          )}

          <form action="" onSubmit={handleSubmit} className="mb-2">
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Age"
                value={personalData.age}
                onChange={(e) =>
                  setPersonalData({ ...personalData, age: e.target.value })
                }
                className={inputClass}
                autoComplete="new-age"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={personalData.fullName}
                onChange={(e) =>
                  setPersonalData({ ...personalData, fullName: e.target.value })
                }
                className={inputClass}
                autoComplete="new-name"
              />
              <input
                type="text"
                placeholder="Education Degree"
                value={personalData.educationDegree}
                onChange={(e) =>
                  setPersonalData({
                    ...personalData,
                    educationDegree: e.target.value,
                  })
                }
                className={inputClass}
                autoComplete="new-degree"
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-6 py-3  rounded-xl cursor-pointer"
            >
              Update
            </Button>
          </form>
          <Button
            type="button"
            onClick={reset}
            className="w-full py-3 mb-2 rounded-xl cursor-pointer bg-white text-gray-600 border border-gray-300 hover:bg-gray-200 "
          >
            Reset
          </Button>
          <Button
            onClick={handleLogout}
            className="w-full rounded-xl bg-red-500 py-3 text-white font-medium shadow-md transition hover:bg-red-600 active:scale-95 cursor-pointer"
          >
            Logout
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
