import React from "react";
import SpotifyPlaylists from "./SpotifyPlaylists";
import YoutubePlaylists from "./YoutubePlaylists";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export const Dashboard = () => {
  const convertFrom = useSelector((state: any) => state.store.convertFrom);

  const handleRender = () => {
    console.log(convertFrom);
    if (convertFrom == "Youtube") {
      return <YoutubePlaylists />;
    } else if (convertFrom == "Spotify") {
      return <SpotifyPlaylists />;
    } else {
      return "That platform is not yet Supported :(";
    }
  };

  return handleRender();
};
