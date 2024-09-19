import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SignUpState {
  data: {
    selectedGender: number | null;
    selectedProvince: number | null;
  };
}

const initialState: SignUpState = {
  data: {
    selectedGender: null,
    selectedProvince: null,
  }
};

const signUpSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setSelectedGender(state, action: PayloadAction<number | null>) {
      state.data.selectedGender = action.payload;
    },
    setSelectedProvince(state, action: PayloadAction<number | null>) {
      state.data.selectedProvince = action.payload;
    },
  },
});

export const {
  setSelectedGender,
  setSelectedProvince,
} = signUpSlice.actions;
export default signUpSlice.reducer;
