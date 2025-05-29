import {createSlice} from '@reduxjs/toolkit';

interface authState {
  id: string;
  accessToken: string;
  name: string;
  avatar?: string;
}
const initialState: authState = {
  id: '',
  accessToken: '',
  name: '',
  avatar: '',
};
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.authData = action.payload;
    },
    removeAuth: state => {
      state.authData = initialState;
    },
  },
});
export const authReducer = authSlice.reducer;
export const {addAuth, removeAuth} = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.authData;
