import { createContext, useContext, useEffect, useReducer } from "react";

// Create Context
export const AuthContext = createContext();

// Auth Reducer
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

// Auth Context Provider Component
export default function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
  });

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (user && token) {
        dispatch({
          type: "LOGIN",
          payload: { user, token },
        });
      }
    } catch (error) {
      console.error("Error restoring session:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hoook to use Auth Context
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext must be used inside an AuthContextProvider");
  }

  return context;
};
