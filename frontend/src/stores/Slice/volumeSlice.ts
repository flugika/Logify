import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VolumeState {
  data: {
    volume: number
  };
}

const initialState: VolumeState = {
  data: {
    volume: 30,
  }
};

const volumeSlice = createSlice({
  name: 'volume',
  initialState,
  reducers: {
    setVolume(state, action: PayloadAction<number>) {
      state.data.volume = action.payload;
    },
  },
});

export const { setVolume } = volumeSlice.actions;
export default volumeSlice.reducer;
