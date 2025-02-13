import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
const storedAccessToken =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  // Consider the user logged in if an accessToken is present in localStorage.
  isLoggedIn: storedAccessToken ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Save user to localStorage
      // Optionally, you might also save accessToken in a similar way.
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user"); // Clear user from storage on logout
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
    },
    // This reducer can be used to synchronize the login state (for example, if tokens change externally)
    updateIsLoggedIn: (state) => {
      const accessToken =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      state.isLoggedIn = Boolean(accessToken);
    },
    // Alternatively, if you wanted a reducer called "isLoggedIn" (not typical), you could do:
    // isLoggedIn: (state) => {
    //   const accessToken =
    //     typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    //   state.isLoggedIn = Boolean(accessToken);
    // },
  },
});

export const { setUser, logout, updateIsLoggedIn } = authSlice.actions;
export default authSlice.reducer;

// Selector to check if the user is logged in from anywhere in your app.
export const selectIsLoggedIn = (state: any) => state.auth.isLoggedIn;
