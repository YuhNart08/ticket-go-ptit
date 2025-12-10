import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "@/utils/axiosInterceptor";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const refreshPendingOrdersCount = async () => {
    if (!localStorage.getItem("token")) {
      setPendingOrdersCount(0);
      return;
    }
    try {
      const response = await axios.get("/api/orders/pending-tickets-count");
      setPendingOrdersCount(response.data.totalTickets || 0);
    } catch (error) {
      console.error("Failed to fetch pending orders count:", error);
      setPendingOrdersCount(0);
    }
  };

  useEffect(() => {
    refreshPendingOrdersCount();
  }, [user, token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
      delete axios.defaults.headers.common["Authorization"];
      setPendingOrdersCount(0);

      window.location.href = "/";
    }
  };

  const updateUser = (newToken) => {
    try {
      const decodedUser = jwtDecode(newToken);
      setUser(decodedUser);
      setToken(newToken);
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const value = {
    user,
    token,
    loading,
    isLoggedIn: !!user,
    login,
    logout,
    updateUser,
    pendingOrdersCount,
    refreshPendingOrdersCount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
