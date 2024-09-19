import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MoodInterface } from '../../interfaces/IMood';
import { CategoryInterface } from "../../interfaces/ICategory";
import { UserInterface } from "../../interfaces/IUser";

interface SearchState {
  data: {
    user: UserInterface;
    moods: MoodInterface[];
    categories: CategoryInterface[];
    selectedUser: number | null;
    selectedMood: number | null;
    selectedMusic: number | null,
    selectedCategory: number | null;
    errorMessage: string;
  };
}

const initialState: SearchState = {
  data: {
    user: {},
    moods: [],
    categories: [],
    selectedUser: null,
    selectedMood: null,
    selectedMusic: null,
    selectedCategory: null,
    errorMessage: '',
  }
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setErrorMessage(state, action: PayloadAction<string>) {
      state.data.errorMessage = action.payload;
    },
    setUser(state, action: PayloadAction<UserInterface>) {
      state.data.user = action.payload;
    },
    setSelectedUser(state, action: PayloadAction<number | null>) {
      state.data.selectedUser = action.payload;
    },
    setMoods(state, action: PayloadAction<MoodInterface[]>) {
      state.data.moods = action.payload;
    },
    setSelectedMood(state, action: PayloadAction<number | null>) {
      state.data.selectedMood = action.payload;
    },
    setSelectedMusic(state, action: PayloadAction<number | null>) {
      state.data.selectedMusic = action.payload;
    },
    setCategories(state, action: PayloadAction<CategoryInterface[]>) {
      state.data.categories = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<number | null>) {
      state.data.selectedCategory = action.payload;
    },
    clearFilters(state) {
      state.data.selectedUser = null;
      state.data.selectedMood = null;
      state.data.selectedMusic = null;
      state.data.selectedCategory = null;
    },
  },
});

export const {
  setUser,
  setMoods,
  setSelectedMood,
  setSelectedMusic,
  setCategories,
  setSelectedCategory,
  clearFilters,
  setSelectedUser,
  setErrorMessage
} = searchSlice.actions;
export default searchSlice.reducer;
