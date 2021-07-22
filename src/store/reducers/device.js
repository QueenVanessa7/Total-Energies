import { createSlice } from "@reduxjs/toolkit";

const intialState = {
  selectedDevice_id: null,
  voltage: 0,
  current: 0,
  power: 0,
  createdAt: null,
  devices: [],
  chartData: {},
  timeRange: "",
};
const deviceSlice = createSlice({
  name: "device",
  initialState: intialState,
  reducers: {
    setDeviceData(state, action) {
      state.selectedDevice_id = action.payload.selectedDevice_id;

      state.devices = action.payload.devices;
    },
    upadateDeviceParameters(state, action) {
      state.voltage = action.payload.voltage;
      state.current = action.payload.current;
      state.power = action.payload.power;
      state.createdAt = action.payload.createdAt;
      state.selectedDevice_id = action.payload.selectedDevice_id;
    },
    setDeviceChartData(state, action) {
      state.chartData = action.payload.chartData;
      state.timeRange = action.payload.timeRange;
    },

    setDevices(state, action) {
      state.devices = action.payload.devices;
    },
    setNewSelectedDevice(state, action) {
      state.selectedDevice_id = action.payload.device_imei;
    },
  },
});

export default deviceSlice;
