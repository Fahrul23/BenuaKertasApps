import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser } from '@/services/authService'

// ─── Async Thunk ────────────────────────────────────────────────────
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials)
      // Simpan token ke localStorage
      localStorage.setItem('token', data.token)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login gagal. Periksa kembali kredensial Anda.'
      )
    }
  }
)

// ─── Slice ───────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
