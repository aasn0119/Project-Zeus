import ChatPage from "./Pages/ChatPage";
import ListPage from "./Pages/ListPage";
import LoginPage from "./Pages/LoginPage";
import { Route, Routes, Navigate } from "react-router-dom";
import ProfilePage from "./Pages/ProfilePage";
import Layout from "./Pages/Layout";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<ListPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
