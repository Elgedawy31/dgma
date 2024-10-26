import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {
            id: "",
            role: "",
            email: "",
            token: "",
            createdAt: "",
            updatedAt: "",
            profilePicture: null,
            name: { first: "", last: "" },
        },
    },
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload;
        }
    }
})
/**
 * {
  "user": {
    "id": "6703bdd588dff50af4b25e18",
    "email": "admin@admin.com",
    "name": {
      "first": "Super",
      "last": "Admin"
    },
    "role": "admin",
    "profilePicture": null,
    "createdAt": "2024-10-07T10:54:13.454Z",
    "updatedAt": "2024-10-11T23:19:57.886Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDNiZGQ1ODhkZmY1MGFmNGIyNWUxOCIsImlhdCI6MTcyODY4ODc5N30.v9q2fZigyK4CHXN2kEt-omlTEb4XtpWrfJSTlT6hCj0"
}
 * 
 * 
 * 
 * const { createSlice } = require("@reduxjs/toolkit");

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {
            fName: "",
            lName: "",
            email: "",
            phone: "",
            age: 0,
            isLogged: false
        },
    },
    reducers: {
        setUserData: (state, action) => {
            state.user = {
                ...action.payload,
                isLogged: true
            }
        },
        resetUserData: (state, action) => {
            state.user = {
                uid: "",
                name: "",
                email: "",
                phone: "",
                age: 0,
                isLogged: false
            };
        },
    }
});


export default userSlice.reducer
export const { setUserData, resetUserData } = userSlice.actions
 */