import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import useAuth from "./auth/useAuth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScheduleScreen from "./screens/ScheduleScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import UsersScreen from "./screens/UsersScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AddCallsScreen from "./screens/AddCallsScreen";

function App() {
    return (
        <BrowserRouter>
            <Header />

            <main>
                <Container style={{ marginTop: 10, marginBottom: 10 }}>
                    <Routes>
                        <Route path="/" element={<WelcomeScreen />} exact />
                        <Route
                            path="/login"
                            element={<WelcomeScreen />}
                            exact
                        />
                        <Route
                            path="/logout"
                            element={<WelcomeScreen />}
                            exact
                        />
                        <Route
                            path="/schedule"
                            element={<ScheduleScreen />}
                            exact
                        />
                        <Route
                            path="/addCalls"
                            element={<AddCallsScreen />}
                            exact
                        />
                        <Route
                            path="/settings"
                            element={<SettingsScreen />}
                            exact
                        />
                        <Route path="/users" element={<UsersScreen />} exact />
                    </Routes>
                </Container>
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;