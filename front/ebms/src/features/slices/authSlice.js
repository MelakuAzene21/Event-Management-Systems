import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    isError: false,
    error: null,
    pendingRegistration: null,  // <--- NEW
  },
    reducers: {
        setUser(state, action) {
            state.user = action.payload; // Set the user information
        },
         setPendingRegistration(state, action) {
             state.pendingRegistration = action.payload;
           },
       clearPendingRegistration(state) {
             state.pendingRegistration = null;
           },
        setFollowedOrganizers(state, action) {
            if (state.user) {
                state.user.followedOrganizers = action.payload.followedOrganizers;
            }
        },

    setProfilePhoto(state, action) {
      if (state.user) {
        state.user = { ...state.user, avatar: action.payload };
      }
    },
    logout(state) {
      state.user = null;
      state.isLoading = false;
      state.isError = false;
      state.error = null;
    },
    // Portfolio-related actions
    addPortfolioItem(state, action) {
      if (state.user) {
        state.user = {
          ...state.user,
          portfolio: [...(state.user.portfolio || []), action.payload]
        };
      }
    },
    togglePortfolioMenu(state, action) {
      if (state.user && state.user.portfolio) {
        const index = action.payload;
        state.user.portfolio[index].showMenu = !state.user.portfolio[index].showMenu;
      }
    },
    updatePortfolioItem(state, action) {
      if (state.user && state.user.portfolio) {
        const index = state.user.portfolio.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          const updatedPortfolio = [...state.user.portfolio];
          updatedPortfolio[index] = action.payload;
          state.user = {
            ...state.user,
            portfolio: updatedPortfolio
          };
        }
      }
    },
    deletePortfolioItem(state, action) {
      if (state.user && state.user.portfolio) {
        state.user = {
          ...state.user,
          portfolio: state.user.portfolio.filter(item => item._id !== action.payload)
        };
      }
    },
    setPortfolio(state, action) {
      if (state.user) {
        state.user = {
          ...state.user,
          portfolio: action.payload
        };
      }
    },
  extraReducers: (builder) => {
    // Login
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = {
          ...action.payload.account,
          portfolio: action.payload.account.portfolio || []
        };
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      });

    // Signup
    builder
      .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, action) => {
        state.user = {
          ...action.payload.user,
          portfolio: action.payload.user.portfolio || []
        };
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.signup.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.signup.matchRejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      });

    // Get Current User
    builder
      .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.user = {
          ...action.payload,
          portfolio: action.payload.portfolio || []
        };
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      });

    // Logout
    builder
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      });
  },
}
});

export const { 
  setUser, 
  logout, 
  setFollowedOrganizers,
  setProfilePhoto,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  togglePortfolioMenu,
  setPendingRegistration,
  clearPendingRegistration,
  setPortfolio
} = authSlice.actions;

export default authSlice.reducer;