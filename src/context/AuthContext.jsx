'use client';

// FUTURE BACKEND INTEGRATION:
// Replace this local login and authentication simulation with your real authentication API / JWT session endpoints.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/storage';
import { useNotification } from '@/hooks/useNotification';
import { useRouter } from 'next/navigation';
import api from '@/service/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // const [isLoading, setIsLoading] = useState(true);
  const { notify } = useNotification();
  const[user,setUser] = useState({});
    const router = useRouter();
    const[isAuthenticated,setIsAuthenticated] = useState(null);
    // this function is usefull to check user is already loged in or not 
    const handleAuth = async ()=>{
        const token = localStorage.getItem("access");
            if (!token) {
                console.log("no access token");
                setIsAuthenticated(false);
                    setUser({});
                return;
                }
            try{
                const decoded = jwtDecode(token)
                const expiry_date = decoded.exp
                const current_time = Date.now()/1000
                if(expiry_date < current_time){
                    console.log("token has Expired");
                    notify.info("token has expired");
                    localStorage.removeItem("access");

                    setIsAuthenticated(false);
                    setUser({});
                    return ;
                }
                setIsAuthenticated(true);

                const res = await api.get("/auth/getuser");

                    setUser(res.data);

            }catch(err){
              const status = err.response?.status;

               if (status === 401) {
                 console.log("Backend rejected the access token");

                  localStorage.removeItem("access");
                   notify.error("Server down Please try again later");
                  setIsAuthenticated(false);
                  setUser({});
                
                
              }
                

            }
    }

     
    useEffect(()=>{
        handleAuth();

    },[])

    const logout = () => {
        localStorage.removeItem("access");
        setUser(null);
        setIsAuthenticated(false);
        router.push("/");
    };



  

  

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
