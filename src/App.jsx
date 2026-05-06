


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Signup from "./components/Signup"; // 👈 ADD THIS IMPORT
import Feed from "./components/Feed";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./utils/appStore";
import EditProfile from "./components/EditProfile";
import { Toaster } from "react-hot-toast";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Membership from "./components/Membership";
// src/App.js
import Chat from "./components/chat"; // 👈 Use 'chat' if the file is chat.jsx
import socket from './utils/socket';
function App() {
  return (
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Body />}>
              <Route index element={<Feed />} />
              <Route path="feed" element={<Feed />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} /> {/* 👈 Path updated for consistency */}
              <Route path="profile" element={<EditProfile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
              <Route path="chat/:connectionId" element={<Chat />} />
<Route path="membership" element={<Membership />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
