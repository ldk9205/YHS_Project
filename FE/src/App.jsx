import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import FileList from "./pages/FileList";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/files" element={<FileList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
