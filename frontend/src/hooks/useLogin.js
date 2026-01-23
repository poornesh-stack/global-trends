import { useState } from "react";
import { useAuthContext } from "../context/AuthContextProvider";

export default function useLogin() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (identifier, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || "Login failed");
        return false;
      }

      // Save user and token separately to localStorage
      localStorage.setItem("user", JSON.stringify(json.user));
      localStorage.setItem("token", json.token);

      // Update the auth context with both user and token
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

  return { login, isLoading, error };
}
