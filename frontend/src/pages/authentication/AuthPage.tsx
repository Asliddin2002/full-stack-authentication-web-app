import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function AuthPages() {
  const [page, setPage] = useState<"login" | "signup">("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  const inputClass =
    "w-full p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  const title = page === "login" ? "Welcome Back" : "Create Account";
  const buttonText = page === "login" ? "Login" : "Sign Up";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/20">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              {title}
            </h2>

            {page === "login" ? (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={signUpData.email}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, email: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={signUpData.password}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, password: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={signUpData.confirm}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, confirm: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            )}

            <Button className="w-full mt-6 py-3 text-lg rounded-xl">
              {buttonText}
            </Button>

            <div className="text-center mt-4 text-sm text-white">
              {page === "login" ? (
                <p>
                  Don&apos;t have an account?{" "}
                  <span
                    className="text-blue-600 cursor-pointer font-bold"
                    onClick={() => setPage("signup")}
                  >
                    Sign Up
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <span
                    className="text-blue-600 cursor-pointer font-bold"
                    onClick={() => setPage("login")}
                  >
                    Login
                  </span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
