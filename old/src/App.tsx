import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import SpotifyPlaylists from "./components/SpotifyPlaylists";
import YoutubePlaylists from "./components/YoutubePlaylists";
import YTPlaylist from "./components/YTPlaylist";
import SPPlaylist from "./components/SPPlaylist";
import { Dashboard } from "./components/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/spotify-playlists" element={<SpotifyPlaylists />} />
        <Route path="/youtube-playlists" element={<YoutubePlaylists />} />
        <Route path="/convert-youtube" element={<YTPlaylist />} />
        <Route path="/convert-spotify" element={<SPPlaylist />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
