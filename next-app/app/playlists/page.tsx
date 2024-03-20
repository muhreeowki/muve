"use client";
import PlaylistTable from "./PlaylistTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylist } from "../redux/slices.js";
import { useRouter } from "next/navigation.js";

const Playlists = () => {
  const convertFrom = useSelector((state: any) => state.store.convertFrom);
  const user = useSelector((state: any) => state.store.user);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<
    {
      title: string;
      image: string;
      description: string;
      owner: string;
      totalItems: number;
      originalObject: any;
    }[]
  >([]);
  const router = useRouter();
  const dispatch = useDispatch();

  const GetYTPlaylists = () => {
    axios
      .get("http://127.0.0.1:8000/youtube/playlists/", {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      })
      .then((response) => {
        console.log("YOUTUBE DATA: ");
        console.log(response.data.items);
        setPlaylists(
          response.data.items.map((item: any) => {
            return {
              title: item.snippet.title,
              image:
                item.snippet.thumbnails.high.url ||
                "https://img.freepik.com/free-photo/beautiful-young-slim-woman-doing-stretching-exercises-gym-against-white_155003-17254.jpg?w=996&t=st=1703149645~exp=1703150245~hmac=ae580533990b7c9fd661e2d4edd70b28f99171b3bc925174a13a7bb349fe4776",
              description: item.snippet.description || "No Description",
              owner: item.snippet.channelTitle,
              totalItems: item.contentDetails.itemCount,
              originalObject: item,
            };
          }),
        );
        setLoading(false);
      });
  };

  const GetSPPlaylists = () => {
    axios
      .get("http://127.0.0.1:8000/spotify/get-playlists/", {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      })
      .then((response) => {
        console.log("SPOTIFY DATA: ");
        console.log(response.data.items);
        setPlaylists(
          response.data.items.map((item: any) => {
            return {
              title: item.name,
              image:
                item.images.length > 0
                  ? item.images[0].url
                  : "https://img.freepik.com/free-photo/beautiful-young-slim-woman-doing-stretching-exercises-gym-against-white_155003-17254.jpg?w=996&t=st=1703149645~exp=1703150245~hmac=ae580533990b7c9fd661e2d4edd70b28f99171b3bc925174a13a7bb349fe4776",
              description: item.description,
              owner: item.owner.display_name,
              totalItems: item.tracks.total,
              originalObject: item,
            };
          }),
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    if (convertFrom === "Youtube") {
      GetYTPlaylists();
    } else if (convertFrom === "Spotify") {
      GetSPPlaylists();
    } else {
      return;
    }
  }, []);

  const handleRender = () => {
    console.log(convertFrom);
    if (convertFrom == "Youtube") {
      return loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <PlaylistTable playlists={playlists} platform="Youtube" />
      );
    } else if (convertFrom == "Spotify") {
      return loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <PlaylistTable playlists={playlists} platform="Spotify" />
      );
    }
  };

  return handleRender();
};

export default Playlists;
