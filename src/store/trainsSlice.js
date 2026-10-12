import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3000/trains";

export const fetchTrains = createAsyncThunk("trains/fetchTrains", async () => {
  const res = await fetch(API_URL);
  return res.json();
});

export const addTrain = createAsyncThunk(
  "trains/addTrain",
  async (train, { rejectWithValue }) => {
    let res;

    try {
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(train),
      });
    } catch {
      return rejectWithValue("Server is not running");
    }

    if (!res.ok) {
      return rejectWithValue("Could not add train route, please try again");
    }

    return res.json();
  },
);

const trainsSlice = createSlice({
  name: "trains",
  initialState: {
    items: [],
    loaded: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrains.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loaded = true;
        state.error = "";
      })
      .addCase(fetchTrains.rejected, (state) => {
        state.error = "Server is not running";
      })
      .addCase(addTrain.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default trainsSlice.reducer;
