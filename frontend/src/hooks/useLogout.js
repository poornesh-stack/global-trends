import { useAuthContext } from "../context/AuthContextProvider";

export default function useLogout() {
  const { dispatch } = useAuthContext();

  const logout = () => {
    // Remove both user and token from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Dispatch logout action (clears both user and token from context)
    dispatch({ type: "LOGOUT" });
  };
  return { logout };
}
