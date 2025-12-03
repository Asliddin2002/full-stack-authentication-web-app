import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useLogin } from "../../models/auth/useLogin";
import { useAuth } from "../../lib/hooks/useAuth";
import { useSignUp } from "../../models/auth/useSignUp";

const inputClass =
  "w-full p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

export default function AuthPages() {
  const [page, setPage] = useState<"login" | "signup">("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  const navigate = useNavigate();

  const {
    mutate: login,
    error: loginErr,
    isError: isLoginErr,
    isPending: isLoginPending,
  } = useLogin();

  const {
    mutate: signUp,
    error: signUpErr,
    isError: isSignUpErr,
    isPending: isSignUpPending,
  } = useSignUp();
  const { handleSetToken } = useAuth();

  const title = page === "login" ? "Welcome Back" : "Create Account";
  const buttonText = page === "login" ? "Login" : "Sign Up";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (page === "login") {
      login(
        { email: loginData.email, password: loginData.password },
        {
          onSuccess: (data) => {
            if (data.token) {
              localStorage.setItem("accessToken", data.token);
              handleSetToken(data.token);
              navigate("/");
            }
          },

          onError: (error) => console.error("Error", error),
        }
      );
    } else if (page == "signup") {
      if (signUpData.confirm === signUpData.password)
        signUp(
          { email: signUpData.email, password: signUpData.password },
          {
            onSuccess: (data) => {
              if (data.token) {
                localStorage.setItem("accessToken", data.token);
                handleSetToken(data.token);
                navigate("/");
              }
            },
          }
        );
    }
  };

  const buttonDisable =
    page === "signup" &&
    signUpData.confirm !== signUpData.password &&
    !signUpData.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 p-4">
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
            <form action="" onSubmit={handleSubmit} autoComplete="off">
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
                    autoComplete="new-email"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className={inputClass}
                    autoComplete="new-password"
                  />
                  {isLoginErr && (
                    <span className="text-xs font-semibold text-red-500">
                      {loginErr.message}
                    </span>
                  )}
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
                    autoComplete="new-email"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, password: e.target.value })
                    }
                    className={inputClass}
                    autoComplete="new-password"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={signUpData.confirm}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, confirm: e.target.value })
                    }
                    className={inputClass}
                    autoComplete="new-password"
                  />
                  {isSignUpErr && (
                    <span className="text-xs font-semibold text-red-500">
                      {signUpErr.message}
                    </span>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSignUpPending || isLoginPending || buttonDisable}
                className="w-full mt-6 py-3 text-lg rounded-xl cursor-pointer"
              >
                {buttonText}
              </Button>
            </form>

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
