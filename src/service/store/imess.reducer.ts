import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI, patchAPI, postAPI } from "../apis/axios";
import { toast } from "react-toastify";
import { StatusType } from "../../components/Status";

export interface ImessUploadDataDto {
  receiver: string;
  message: string;
}

interface FilterListImess {
  page?: number;
  size?: number;
  from?: number;
  to?: number;
  deviceId?: number;
  fileName?: string;
  filterStatus?: string;
  filterMode?: string;
  sender?: string;
  sortField?: string;
  receiver?: string;
}

export interface Imess {
  id: number;
  count: number;
  userId: number;
  deviceId: number;
  sender: string;
  receiver: string;
  message: string;
  filename: string;
  mode: string;
  status: StatusType;
  priority: any;
  description: string;
}

interface InitialState {
  loading: boolean;
  error: any[];
  listImess: {
    total: number;
    page: number;
    last_page: number;
    result?: Imess[];
  };
}

export const getSingleImess = createAsyncThunk("getSingleImess", async () => {
  try {
    const res = await getAPI(`/send-imess/get-single-imess`);
    return res.data;
  } catch (err) {
    throw err;
  }
});
export const getImessToSend = createAsyncThunk("getImessToSend", async (body: FilterListImess) => {
  try {
    const res = await getAPI(`/send-imess/get-imess-to-send`, {
      params: {
        sortType: "DESC",
        ...body,
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
});
export const imessUploadData = createAsyncThunk(
  "imessUploadData",
  async (body: { filename: string; data: ImessUploadDataDto[] }) => {
    try {
      const res = await postAPI(`/send-imess/upload-data`, body);
      return res;
    } catch (err) {
      throw err;
    }
  },
);
export const updateMessage = createAsyncThunk(
  "updateMessage",
  async (params: { id: string; body: { message: string } }) => {
    try {
      const res = await patchAPI(`/send-imess/upload-data/${params.id}`, params.body);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
);
export const updateStatus = createAsyncThunk(
  "updateStatus",
  async (params: {
    id: string;
    body: {
      status: string;
      sender: string;
    };
  }) => {
    try {
      const res = await patchAPI(`/send-imess/upload-data/${params.id}`, params.body);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
);

const initialState: InitialState = {
  loading: false,
  error: [],
  listImess: {
    total: 10,
    page: 1,
    last_page: 1,
    result: [],
  },
};

const imessSlice = createSlice({
  name: "imess",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    // get single imess
    [`${getSingleImess.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getSingleImess.rejected}`]: (state, action) => {
      state.loading = false;
      state.error.push(action.error);
    },
    [`${getSingleImess.fulfilled}`]: (state, action) => {
      state.loading = false;
    },
    // get imess to send
    [`${getImessToSend.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getImessToSend.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getImessToSend.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.listImess = action.payload;
    },
    // upload data
    [`${imessUploadData.pending}`]: (state) => {
      state.loading = true;
    },
    [`${imessUploadData.rejected}`]: (state, action) => {
      state.loading = false;
      toast.error("Tải lên imess thất bại");
      state.error = action.error;
    },
    [`${imessUploadData.fulfilled}`]: (state, action) => {
      toast.success("Tải lên imess thành công");
      state.loading = false;
    },
    // update message
    [`${updateMessage.pending}`]: (state) => {
      state.loading = true;
    },
    [`${updateMessage.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${updateMessage.fulfilled}`]: (state, action) => {
      state.loading = false;
    },
    // update status
    [`${updateStatus.pending}`]: (state) => {
      state.loading = true;
    },
    [`${updateStatus.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${updateStatus.fulfilled}`]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer: imessReducer } = imessSlice;

export default imessReducer;
