import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteAPI, getAPI, patchAPI, postAPI, putAPI } from "../apis/axios";
import { toast } from "react-toastify";

export interface CreateDeviceDto {
  name: string;
  url: string;
  username: string;
  password: string;
  serialNumber: string;
}

interface InitialState {
  loading: boolean;
  error: any[];
  devices: Partial<CreateDeviceDto & { id: string }>[];
  device: Partial<CreateDeviceDto & { id: string }>;
  blockAccount: Partial<CreateDeviceDto & { id: string }>;
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
    const res = await putAPI(`/device/update/${params.id}`, params.body);
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
    await deleteAPI(`/device/remove/${id}`);
    return id;
  } catch (err) {
    throw err;
  }
});

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {},
  extraReducers: {
    // get check blocked icloud
    [`${checkBlockedIcloud.pending}`]: (state, action) => {
      state.loading = true;
    },
    [`${checkBlockedIcloud.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.blockAccount = action.payload;
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
    [`${getDevices.rejected}`]: (state, action) => {
      state.loading = false;
      state.error.push(action.payload);
    },
    // get device
    [`${getDevice.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getDevice.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.device = action.payload;
    },
    [`${getDevice.rejected}`]: (state, action) => {
      state.loading = false;
      state.error.push(action.payload);
    },
    // create Device
    [`${createDevice.pending}`]: (state) => {
      state.loading = true;
    },
    [`${createDevice.fulfilled}`]: (state, action) => {
      state.loading = false;
      toast.success("tạo device thành công");
      state.devices.push(action.payload);
    },
    [`${createDevice.rejected}`]: (state, action) => {
      state.loading = false;
      toast.error("tạo device thất bại");
      state.error.push(action.payload);
    },
    // update Device
    [`${updateDevice.pending}`]: (state, action) => {
      state.loading = false;
    },
    [`${updateDevice.fulfilled}`]: (state, action) => {
      state.loading = false;
      toast.success("cập nhật device thành công");
      const item = state.devices.find((d) => d.id === action.payload.id);
      const index = item && state.devices.indexOf(item);
      if (typeof index === "number") {
        state.devices[index] = action.payload;
      }
    },
    [`${updateDevice.rejected}`]: (state, action) => {
      state.loading = false;
      toast.error("cập nhật device thất bại");
      state.error.push(action.payload);
    },
    //block or unblock device
    [`${blockOrUnblock.pending}`]: (state) => {
      state.loading = true;
    },
    [`${blockOrUnblock.fulfilled}`]: (state, action) => {
      toast.success(`cập nhật trạng thái ${action.payload.name} thành công`);
      const item = state.devices.find((d) => d.id === action.payload.id);
      const index = item && state.devices.indexOf(item);
      if (typeof index === "number") {
        state.devices[index] = action.payload;
      }
      state.loading = false;
    },
    [`${blockOrUnblock.rejected}`]: (state, action) => {
      state.loading = false;
      toast.error("cập nhật trạng thái thất bại");
      state.error.push(action.payload);
    },
    //deleteDevice
    [`${deleteDevice.pending}`]: (state) => {
      state.loading = true;
    },
    [`${deleteDevice.fulfilled}`]: (state, action) => {
      toast.success("Xóa device thành công");
      const item = state.devices.find((d) => d.id === action.payload);
      const index = item && state.devices.indexOf(item);
      index && state.devices.splice(index, 1);
      state.loading = false;
    },
    [`${deleteDevice.rejected}`]: (state) => {
      toast.success("Xóa device thất bại");
      state.loading = false;
    },
  },
});

const { reducer: deviceReducer } = deviceSlice;

export default deviceReducer;
