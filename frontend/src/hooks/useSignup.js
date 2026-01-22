import { useState } from "react";
import { useAuthContext } from "../context/AuthContextProvider";

export default function useSignup() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (signupData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || "Signup failed");
        return false;
      }

      // Save user and token separately to localStorage
      localStorage.setItem("user", JSON.stringify(json.user));
      localStorage.setItem("token", json.token);

      //update the auth context
      dispatch({
        type: "LOGIN",
        payload: {
          user: json.user,
          token: json.token,
        },
      });

      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      setError("Network error. Please try again.");
      return false;
    }
  };

  return { signup, isLoading, error };
}
