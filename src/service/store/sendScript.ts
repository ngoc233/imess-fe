import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI, patchAPI } from "../apis/axios";
import { toast } from "react-toastify";

interface FilterListImess {
  page?: number;
  size?: number;
  from?: number;
  to?: number;
  deviceId?: number;
  fileName?: string;
  sortField?: string;
}

export interface SendScript {
  id: number;
  fail: string;
  filename: string;
  pending: string;
  priority: number;
  stop: number;
  sending: string;
  success: string;
  total: string;
  status: string;
  created_at: string;
}

interface InitialState {
  loading: boolean;
  error: any[];
  listFileStatus: {
    total: number;
    page: number;
    last_page: number;
    result?: SendScript[];
  };
}

export const getFiles = createAsyncThunk("getFiles", async (body: FilterListImess) => {
  try {
    const res = await getAPI(`/send-imess/get-files`, {
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
export const stopStartFile = createAsyncThunk(
  "stopStartFile",
  async (params: { filename: string; body: { stop: number } }) => {
    try {
      await patchAPI(`/send-imess/stop-start-file/${params.filename}`, params.body);
      return params;
    } catch (err) {
      throw err;
    }
  },
);
export const updatePriority = createAsyncThunk(
  "updatePriority",
  async (params: { filename: string; body: { priority: number }; action: (params: number) => void }) => {
    try {
      await patchAPI(`/send-imess/update-priority/${params.filename}`, params.body);
      params.action(-1);
      return params;
    } catch (err) {
      throw err;
    }
  },
);

const initialState: InitialState = {
  loading: false,
  error: [],
  listFileStatus: {
    total: 10,
    page: 1,
    last_page: 1,
    result: [],
  },
};

const sendScriptSlice = createSlice({
  name: "sendScript",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    // get single imess
    [`${getFiles.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getFiles.rejected}`]: (state, action) => {
      state.loading = false;
      state.error.push(action.error);
    },
    [`${getFiles.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.listFileStatus = action.payload;
    },
    // get imess to send
    [`${stopStartFile.pending}`]: (state) => {
      state.loading = true;
    },
    [`${stopStartFile.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${stopStartFile.fulfilled}`]: (state, action) => {
      state.loading = false;
      if (state.listFileStatus.result?.length) {
        console.log(action.payload);
        const item = state.listFileStatus.result.find((d) => d.filename === action.payload.filename);
        const index = item && state.listFileStatus.result.indexOf(item);
        if (typeof index === "number") {
            state.listFileStatus.result[index].stop = action.payload.body.stop;
        }
      }
    },
    // upload data
    [`${updatePriority.pending}`]: (state) => {
      state.loading = true;
    },
    [`${updatePriority.rejected}`]: (state, action) => {
      state.loading = false;
      toast.error("Cập nhật độ ưu tiên thất bại");
      state.error = action.error;
    },
    [`${updatePriority.fulfilled}`]: (state, action) => {
      toast.success("Cập nhật độ ưu tiên thành công");
      state.loading = false;
      if (state.listFileStatus.result?.length) {
        const item = state.listFileStatus.result.find((d) => d.filename === action.payload.filename);
        const index = item && state.listFileStatus.result.indexOf(item);
        if (typeof index === "number") {
          console.log(state.listFileStatus.result[index]);
          state.listFileStatus.result[index].priority = action.payload.body.priority;
        }
      }
    },
  },
});

const { reducer: sendScriptReducer } = sendScriptSlice;

export default sendScriptReducer;
