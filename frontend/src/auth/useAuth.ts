import { useContext } from "react";

import AuthContext from "./AuthContext";
import { AuthState } from "./authState";

const useAuth = () => useContext<AuthState>(AuthContext);

export default useAuth;
