import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../apis/axios";
import { toast } from "react-toastify";

export const authLoginApi = createAsyncThunk(
  "login",
  async (body: { email: string; password: string }) => {
    try {
      const res = await axiosInstance.post(`/auth/login`, body);
      return res;
    } catch (err) {
      throw err;
    }
  }
);

export const restore = createAsyncThunk("restore", async () => {
  try {
    const res = await axiosInstance.get(`/user/me`);
    return res;
  } catch (err) {
    throw err;
  }
});

const deviceSlice = createSlice({
  name: "device",
  initialState: {
    loading: false,
    error: "",
    user: {
      access_token: "",
      user: {},
    },
  },
  reducers: {
    authLogout: (state) => {
      state.user = {
        access_token: "",
        user: {},
      };
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
      toast.error("Đăng nhập thành công");
      state.loading = false;
      state.user = action.payload;
    },
    [`${restore.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
  },
});

export const { authLogout, authLogin } = deviceSlice.actions;

const { reducer: deviceReducer } = deviceSlice;

export default deviceReducer;
