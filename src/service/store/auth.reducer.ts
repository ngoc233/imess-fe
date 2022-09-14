import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../apis/axios";
import { toast } from "react-toastify";
import history from "../../utils/history";

export const authLoginApi = createAsyncThunk("login", async (body: { email: string; password: string }) => {
  try {
    const res = await axiosInstance.post(`/auth/login`, body);
    return res.data.data;
  } catch (err) {
    throw err;
  }
});

export const restore = createAsyncThunk("restore", async () => {
  try {
    const res = await axiosInstance.get(`/user/me`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: "",
    user: null,
  },
  reducers: {
    authLogout: (state) => {
      state.user = null;
    },
    authLogin: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: {
    // get interval volatility
    [`${authLoginApi.pending}`]: (state) => {
      state.loading = true;
    },
    [`${authLoginApi.rejected}`]: (state, action) => {
      state.loading = false;
      toast.error("Tài khoản hoặc mật khẩu không đúng");
      state.error = action.error;
    },
    [`${authLoginApi.fulfilled}`]: (state, action) => {
      const { accessToken, refreshToken, ...rest } = action.payload;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      history.replace("/");
      toast.success("Đăng nhập thành công");
      state.user = rest;
    },
    [`${restore.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
  },
});

export const { authLogout, authLogin } = authSlice.actions;

const { reducer: authReducer } = authSlice;

export default authReducer;
