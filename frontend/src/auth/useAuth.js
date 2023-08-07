import { useContext } from "react";

import AuthContext from "./AuthContext.js";

// Return the following:
// const {
//     // Auth state:
//     error,
//     isAuthenticated,
//     isLoading,
//     user,
//     permissions,
//     // Auth methods:
//     login,
//     logout,
//  } = useAuth();
// Use the `useAuth` hook in your components to access the auth state and methods.

const useAuth = () => useContext(AuthContext);

export default useAuth;
