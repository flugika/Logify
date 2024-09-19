import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './Slice/searchSlice';
import volumeReducer from './Slice/volumeSlice';
import musicReducer from "./Slice/musicSlice";
import signupReducer from "./Slice/signupSlice";

const store = configureStore({
  reducer: {
    search: searchReducer,
    volume: volumeReducer,
    music: musicReducer,
    signup: signupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
