import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchEmployerList = createAsyncThunk('auth/fetchEmployerList', async () => {
  const response = await axios.get(process.env.REACT_APP_SERVER_URL + '/employer/list');
  return response.data;
});

export const selectEmployerList = (state) => state.auth.employerList;

export const selectUserDetails = (state) => state.auth.user;

export const fetchUserDetails = createAsyncThunk('auth/fetchUserDetails', async (email) => {
    const response = await fetch(process.env.REACT_APP_SERVER_URL + `/auth/getuser/${email}`);
    const user = await response.json();
    return user;
  });  

export const loginUser = createAsyncThunk('auth/loginUser', async (authData, { dispatch }) => {
    const response = await fetch(process.env.REACT_APP_SERVER_URL + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
    });

    if (!response.ok) {
        throw new Error('Could not authenticate user.');
    }

    dispatch(fetchUserDetails(authData.email));

    const resData = await response.json();
    return resData;
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (token, { dispatch }) => {
    const response = await fetch(process.env.REACT_APP_SERVER_URL + '/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Could not logout user.');
    }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (authData, { dispatch }) => {
    const response = await fetch(process.env.REACT_APP_SERVER_URL + '/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
    });

    if (!response.ok) {
        throw new Error('Could not register user.');
    }

    dispatch(fetchUserDetails(authData.email));

    const resData = await response.json();
    const token = resData.token;
    localStorage.setItem('token', token);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 2);
    localStorage.setItem('expiration', expiration.toISOString());
    
    return resData;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoggedIn: false,
        status: 'idle',
        error: null,
        employerList: [],
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.fulfilled, (state, action) => {
                    state.user = null;
                    state.isLoggedIn = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'idle';
                state.user = action.payload;
                state.isLoggedIn = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'idle';
                state.error = action.error.message;
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'idle';
                state.user = action.payload;
                state.isLoggedIn = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'idle';
                state.error = action.error.message;
            })
            .addCase(fetchEmployerList.fulfilled, (state, action) => {
                state.employerList = action.payload;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export default authSlice.reducer;