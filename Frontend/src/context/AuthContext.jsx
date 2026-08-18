import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login when app starts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getMe();

        console.log('GET ME RESPONSE:', data);

        setUser(data.user);
      } catch (error) {
        console.log(
          'GET ME FAILED:',
          error.response?.data || error.message
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData) => {
    const data = await loginUser(userData);

    console.log('LOGIN RESPONSE:', data);

    setUser(data.user);

    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);

    setUser(data.user);

    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setUser,
        setAuthUser: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};