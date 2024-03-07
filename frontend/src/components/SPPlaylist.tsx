import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  ListItemButton,
  ListItemText,
  ListItem,
  List,
  CircularProgress,
} from "@mui/material";

const SPPlaylist = () => {
  const user = useSelector((state: any) => state.store.user);
  const playlist = useSelector((state: any) => state.store.currentPlaylist);
  const [playlistItems, setPlaylistItems] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedPlaylistItems, setCheckedPlaylistItems] = useState([]);
  const [converted, setConverted] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const navigate = useNavigate();

  const convertSPPlaylist = () => {
    setLoading(true);
    console.log(checkedPlaylistItems);
    axios
      .post(
        "http://127.0.0.1:8000/youtube/convert/",
        {
          sp_playlist: checkedPlaylistItems,
          new_playlist_name: playlist.name,
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
          setPlaylistUrl(response.data.url || "");
          setLoading(false);
        }
      });
  };

  const fetchSPPlaylist = () => {
    console.log("FETCHING PLAYLIST....");
    axios
      .post(
        "http://127.0.0.1:8000/spotify/get-playlist-items/",
        { tracks_url: playlist.tracks.href },
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
    fetchSPPlaylist();
    setLoading(false);
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
              Converting: {playlist.name}
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
                        className="w-1/5 aspect-square mx-4"
                        src={
                          playlistItems[key].track.album
                            ? playlistItems[key].track.album.images[0].url
                            : ""
                        }
                      />
                      <ListItemText
                        primary={playlistItems[key].track.name}
                        secondary={playlistItems[key].track.artists[0].name}
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
                convertSPPlaylist();
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

export default SPPlaylist;
