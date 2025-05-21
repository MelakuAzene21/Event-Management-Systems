import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: '', // Vendor ID
  name: '',
  email: '',
  role: 'vendor',
  avatar: 'default.jpg', // Profile photo
  files: [],
  rating: 0,
  isApproved: false,
  availability: '',
  portfolio: [],
  createdAt: '',
  updatedAt: '',
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendorData: (state, action) => {
      const {
        _id,
        name,
        email,
        role,
        avatar,
        files,
        rating,
        isApproved,
        availability,
        portfolio,
        createdAt,
        updatedAt,
      } = action.payload;

      state._id = _id;
      state.name = name;
      state.email = email;
      state.role = role;
      state.avatar = avatar;
      state.files = files;
      state.rating = rating;
      state.isApproved = isApproved;
      state.availability = availability;
      state.portfolio = portfolio;
      state.createdAt = createdAt;
      state.updatedAt = updatedAt;
    },
    setProfilePhoto: (state, action) => {
      state.avatar = action.payload; // Update only the avatar field
    },
    clearVendorData: (state) => {
      Object.assign(state, initialState); // Reset to initial state
    },
  },
});

// Export actions for setting and clearing vendor data
export const { setVendorData, setProfilePhoto, clearVendorData } = vendorSlice.actions;

// Export the vendor slice reducer to use in the store
export default vendorSlice.reducer;
