import { createContext } from "react";

import { AuthState } from "./authState";

const initialContext = {} as AuthState;

const AuthContext = createContext<AuthState>(initialContext);

export default AuthContext;
