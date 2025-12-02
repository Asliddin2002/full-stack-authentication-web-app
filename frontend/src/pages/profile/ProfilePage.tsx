import { Button } from "../../components/ui/button";
import { useAuth } from "../../lib/hooks/useAuth";

const ProfilePage = () => {
  const { handleSetToken } = useAuth();

  const handleLogout = () => {
    handleSetToken(undefined);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-semibold text-gray-800">
          Profile
        </h1>

        <p className="mb-8 text-center text-gray-600">
          This is your profile page
        </p>
        <Button
          onClick={handleLogout}
          className="w-full rounded-xl bg-red-500 py-3 text-white font-medium shadow-md transition hover:bg-red-600 active:scale-95 cursor-pointer"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
