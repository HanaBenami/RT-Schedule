import { Container } from "react-bootstrap";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/general/Header";
import Footer from "./components/general/Footer";
import ScheduleScreen from "./screens/ScheduleScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import UsersScreen from "./screens/UsersScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AddCallsScreen from "./screens/AddCallsScreen";
import DemoScreen from "./screens/DemoScreen";

function App() {
    return (
        <Router>
            <Header />

            <main>
                <Container style={{ marginTop: 10, marginBottom: 10 }}>
                    <Routes>
                        <Route path="/" element={<WelcomeScreen />} />
                        <Route path="/login" element={<WelcomeScreen />} />
                        <Route path="/logout" element={<WelcomeScreen />} />
                        <Route path="/demo" element={<DemoScreen />} />
                        <Route path="/schedule" element={<ScheduleScreen />} />
                        <Route path="/addCalls" element={<AddCallsScreen />} />
                        <Route path="/settings" element={<SettingsScreen />} />
                        <Route path="/users" element={<UsersScreen />} />
                    </Routes>
                </Container>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
