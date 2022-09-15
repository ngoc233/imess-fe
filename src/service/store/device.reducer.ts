import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAPI, patchAPI, postAPI } from "../apis/axios";
import { toast } from "react-toastify";

interface CreateDeviceDto {
  name: string;
  url: string;
  username: string;
  password: string;
  serialNumber: string;
}

interface InitialState {
  loading: boolean;
  error: any[];
  devices: CreateDeviceDto[];
  device: Partial<CreateDeviceDto>;
  blockAccount: Partial<CreateDeviceDto>;
}

const initialState: InitialState = {
  loading: false,
  error: [],
  devices: [],
  device: {},
  blockAccount: {},
};

export const checkBlockedIcloud = createAsyncThunk("checkBlockedIcloud", async () => {
  try {
    const res = await getAPI("/device/check-blocked-icloud");
    return res.data;
  } catch (err) {
    throw err;
  }
});
export const createDevice = createAsyncThunk("createDevice", async (body: CreateDeviceDto) => {
  try {
    const res = await postAPI("/device/create", body);
    return res.data;
  } catch (err) {
    throw err;
  }
});
export const getDevices = createAsyncThunk("getDevices", async () => {
  try {
    const res = await getAPI("/device");
    return res.data;
  } catch (err) {
    throw err;
  }
});
export const getDevice = createAsyncThunk("getDevice", async (id: string) => {
  try {
    const res = await getAPI(`/device/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
});
export const updateDevice = createAsyncThunk("updateDevice", async (params: { id: string; body: CreateDeviceDto }) => {
  try {
    const res = await postAPI(`/device/update/${params.id}`, params.body);
    return res.data;
  } catch (err) {
    throw err;
  }
});
export const blockOrUnblock = createAsyncThunk("unBlock", async (params: { id: string; body: { block: boolean } }) => {
  try {
    const res = await patchAPI(`/device/block-unblock/${params.id}`, params.body);
    return res.data;
  } catch (err) {
    throw err;
  }
});
export const deleteDevice = createAsyncThunk("deleteDevice", async (id: string) => {
  try {
    const res = await patchAPI(`/device/remove/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
});

const deviceSlice = createSlice({
  name: "device",
  initialState: {
    loading: false,
    error: [],
    devices: [],
    device: {},
    blockAccount: {},
  },
  reducers: {},
  extraReducers: {
    // get check blocked icloud
    [`${checkBlockedIcloud.pending}`]: (state, action) => {
      state.loading = true;
    },
    [`${checkBlockedIcloud.fulfilled}`]: (state, action) => {
      state.loading = false;
    },
    [`${checkBlockedIcloud.rejected}`]: (state, action) => {
      state.loading = false;
      state.error.push(action.payload);
    },
    // get devices
    [`${getDevices.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getDevices.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.devices = action.payload;
    },
    // get device
    [`${getDevice.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getDevice.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.device = action.payload;
    },
    // create Device
    [`${createDevice.pending}`]: (state) => {
      state.loading = true;
    },
    [`${createDevice.fulfilled}`]: (state, action) => {
      state.loading = false;
    },
    [`${createDevice.rejected}`]: (state, action) => {
      state.loading = false;
    },
    // update Device
    [`${updateDevice.pending}`]: (state, action) => {
      state.loading = false;
    },
    [`${updateDevice.fulfilled}`]: (state, action) => {
      state.loading = false;
    },
    [`${updateDevice.rejected}`]: (state, action) => {
      state.loading = false;
    },
    //block or unblock device
    [`${blockOrUnblock.pending}`]: (state, action) => {
      state.loading = false;
    },
    [`${blockOrUnblock.fulfilled}`]: (state, action) => {
      state.loading = false;
    },
    [`${blockOrUnblock.rejected}`]: (state, action) => {
      state.loading = false;
    },
    //deleteDevice
    [`${deleteDevice.pending}`]: (state, action) => {
      state.loading = false;
    },
    [`${deleteDevice.fulfilled}`]: (state, action) => {
      state.loading = false;
    },
    [`${deleteDevice.rejected}`]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer: deviceReducer } = deviceSlice;

export default deviceReducer;
