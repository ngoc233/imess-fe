import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postAPI } from "../apis/axios";
import { toast } from "react-toastify";

export interface ImessUploadDataDto {
  phonenumber: string;
  message: string;
}
export const imessUploadData = createAsyncThunk(
  "imess-upload-data",
  async (body: { filename: string; data: ImessUploadDataDto[] }) => {
    try {
      const res = await postAPI(`/send-imess/upload-data`, body);
      return res;
    } catch (err) {
      throw err;
    }
  },
);

const imessSlice = createSlice({
  name: "imess",
  initialState: {
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: {
    // get interval volatility
    [`${imessUploadData.pending}`]: (state) => {
      state.loading = true;
    },
    [`${imessUploadData.rejected}`]: (state, action) => {
      state.loading = false;
      toast.success("Tải lên imess thất bại");
      state.error = action.error;
    },
    [`${imessUploadData.fulfilled}`]: (state, action) => {
      toast.error("Tải lên imess thành công");
      state.loading = false;
    },
  },
});

const { reducer: imessReducer } = imessSlice;

export default imessReducer;
