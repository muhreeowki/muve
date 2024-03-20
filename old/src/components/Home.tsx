import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPlaylistTransfer } from "../redux/slices";
import { useDispatch } from "react-redux";

const Home = () => {
  const user = useSelector((state: any) => state.store.user);
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSpotifyLogin = (playlistTransfer) => {
    dispatch(setPlaylistTransfer(playlistTransfer));
    window.location.href = `http://127.0.0.1:8000/spotify/login/?auth_token=${user.token}`;
  };

  useEffect(() => {
    try {
      console.log(user.username);
      console.log(user);
      setAuth(true);
    } catch (error) {
      navigate("/login");
    }
  }, []);

  return auth ? (
    <section className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center my-7">
        <h1 className="font-bold text-4xl md:text-5xl md:my-7 text-neutral-900">
          Welcome to Muve
        </h1>
      </div>
      <div className="w-full flex flex-row justify-around items-center">
        <div
          className="flex flex-col bg-teal-700 text-white hover:cursor-pointer hover:bg-teal-400 hover:text-neutral-900 transition-all w-2/5 h-[30vh] text-center justify-center"
          onClick={() => {
            handleSpotifyLogin({
              convertTo: "Spotify",
              convertFrom: "Youtube",
            });
          }}
        >
          <h1 className="font-bold text-2xl">
            Move from: <br /> Youtube to Spotify
          </h1>
        </div>
        <div
          className="flex flex-col text-white hover:cursor-pointer bg-red-600 hover:bg-red-400 hover:text-neutral-900 transition-all px-2 py-2 w-2/5 h-[30vh] text-center justify-center"
          onClick={() => {
            handleSpotifyLogin({
              convertTo: "Youtube",
              convertFrom: "Spotify",
            });
          }}
        >
          <h1 className="font-bold text-2xl">
            Move from: <br /> Spotify to Youtube
          </h1>
        </div>
      </div>
    </section>
  ) : (
    ""
  );
};

export default Home;
