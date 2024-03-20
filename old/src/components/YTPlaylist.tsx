import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Avatar,
  Checkbox,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  ListItem,
  List,
  CircularProgress,
} from "@mui/material";

const YTPlaylist = () => {
  const user = useSelector((state: any) => state.store.user);
  const playlist = useSelector((state: any) => state.store.currentPlaylist);
  const [playlistItems, setPlaylistItems] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedPlaylistItems, setCheckedPlaylistItems] = useState([]);
  const [converted, setConverted] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const convertPlaylist = () => {
    console.log(checkedPlaylistItems);
    axios
      .post(
        "http://127.0.0.1:8000/spotify/convert/",
        {
          yt_playlist: checkedPlaylistItems,
          new_playlist_name: playlist.snippet.title,
        },
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        },
      )
      .then((response) => {
        console.log(response);
        if (response.data.message === "success" && response.status === 200) {
          console.log("SUCCESS!");
          setConverted(true);
          setPlaylistUrl(response.data.playlist.external_urls.spotify || "");
          setLoading(false);
        }
      });
  };

  const fetchPlaylist = () => {
    setLoading(true);
    console.log("CONVERTING PLAYLIST....");
    axios
      .post(
        "http://127.0.0.1:8000/youtube/get-playlist/",
        { playlist: { ...playlist } },
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        },
      )
      .then((response) => {
        console.log(response);
        setPlaylistItems(response.data.items);
      });
    // uncheck all items in the list
    setLoading(false);
  };

  const selectAllItems = () => {
    const keys = Object.keys(playlistItems);
    let newChecked = [];
    for (let i = 0; i < keys.length; i++) {
      newChecked.push(1);
    }
    setCheckedPlaylistItems(
      newChecked
        .map((value, index) => {
          if (value === 1) return playlistItems[String(index)];
        })
        .filter((value) => value !== undefined),
    ),
      setChecked(newChecked);
  };

  const handleToggle = (index: number) => () => {
    const newChecked = [...checked];
    if (newChecked[index] === 1) {
      newChecked[index] = -1;
    } else {
      newChecked[index] = 1;
    }
    setCheckedPlaylistItems(
      newChecked
        .map((value, index) => {
          if (value === 1) return playlistItems[String(index)];
        })
        .filter((value) => value !== undefined),
    ),
      setChecked(newChecked);
    console.log(newChecked);
  };

  const navigateToPlaylist = () => {
    window.location.href = playlistUrl;
  };

  useEffect(() => {
    console.log("GETTING PLAYLIST ITEMS FOR SELECTED PLAYLIST....");
    fetchPlaylist();
    console.log(playlistItems);
  }, []);

  return (
    <section className="w-full flex h-screen flex-col items-center justify-center">
      {loading || playlistItems.length == 0 ? (
        <CircularProgress />
      ) : converted ? (
        <div className="w-full flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold uppercase">SUCCESS!</h1>
          <div className="w-full max-w-[300px] flex justify-around items-center my-10">
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={navigateToPlaylist}
            >
              Go To Playlist
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[500px] flex h-screen flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center my-7 text-center">
            <h1 className="text-4xl font-bold uppercase text-neutral-900">
              Converting: {playlist.snippet.title}
            </h1>
          </div>
          <Button
            variant="outlined"
            color="primary"
            className="self-end"
            onClick={selectAllItems}
          >
            Select all
          </Button>
          <div className="w-full flex flex-col items-center justify-center h-[800px] overflow-y-scroll">
            <List
              dense
              sx={{
                height: "100%",
                width: "100%",
                maxWidth: 500,
                bgcolor: "background.paper",
              }}
            >
              {Object.keys(playlistItems).map((key) => {
                return (
                  <ListItem
                    key={key}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(Number(key))}
                        checked={checked[Number(key)] === 1}
                      />
                    }
                    disablePadding
                  >
                    <ListItemButton>
                      <img
                        className="w-2/6 aspect-auto mx-4"
                        src={
                          playlistItems[key].snippet.thumbnails.maxres
                            ? playlistItems[key].snippet.thumbnails.maxres.url
                            : playlistItems[key].snippet.thumbnails.high.url
                        }
                      />
                      <ListItemText
                        primary={playlistItems[key].snippet.title}
                        secondary={
                          playlistItems[key].snippet.videoOwnerChannelTitle
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </div>
          <div className="w-full max-w-[500px] flex justify-between items-center my-10">
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setLoading(true);
                convertPlaylist();
              }}
            >
              Convert
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default YTPlaylist;
