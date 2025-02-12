"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, setUser, updateIsLoggedIn } from "@/lib/slices/authSlice";
import { useRouter } from "next/navigation";

interface RefreshResponseData {
  accessToken: string;
  user?: any; // Replace `any` with your User type if available.
}

interface RefreshResponse {
  data: RefreshResponseData;
}

const useRefreshToken = (): void => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Refresh interval in milliseconds (e.g., every 15 minutes)
    const intervalTime = 15 * 60 * 1000;

    const interval = setInterval(async () => {
      try {
        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (!storedRefreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: storedRefreshToken }),
            credentials: "include",
          }
        );

        if (response.ok) {
          const data: RefreshResponse = await response.json();
          // Save the new access token in localStorage.
          localStorage.setItem("accessToken", data.data.accessToken);
          // Optionally update the user in global state if user data is provided.
          if (data.data.user) {
            dispatch(setUser(data.data.user));
          }
          // Update the global isLoggedIn state based on the new access token.
          dispatch(updateIsLoggedIn());
        } else {
          // If the refresh call fails, treat it as session expired.
          throw new Error("Session expired");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        // Dispatch logout action and redirect to login page.
        dispatch(logout());
        router.push("/login");
        // Clear the interval so no further attempts are made.
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [dispatch, router]);
};

export default useRefreshToken;
