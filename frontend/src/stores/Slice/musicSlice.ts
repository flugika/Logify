import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MusicState {
  data: {
    artist: string;
    name: string;
  };
}

const initialState: MusicState = {
  data: {
    artist: "",
    name: "",
  }
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setArtist(state, action: PayloadAction<string>) {
      state.data.artist = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.data.name = action.payload;
    },
  },
});

export const {
  setArtist,
  setName,
} = musicSlice.actions;
export default musicSlice.reducer;
