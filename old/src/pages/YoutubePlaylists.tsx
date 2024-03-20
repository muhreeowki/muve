import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPlaylist } from "../redux/slices.js";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";

const YoutubePlaylists = () => {
  const user = useSelector((state: any) => state.store.user);
  const [loading, setLoading] = useState(true);
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const navigate = useNavigate();
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
        setYoutubePlaylists(response.data.items);
        setLoading(false);
      });
  };

  const openYTPlaylist = (item: any) => {
    dispatch(setPlaylist(item));
    navigate("/convert-youtube");
  };

  useEffect(() => {
    // Check if user is logged in
    try {
      console.log(user.username);
    } catch (err) {
      navigate("/login");
    }

    // Print the logged in user
    console.log(user);

    // Get the users playlists
    GetYTPlaylists();
  }, []);

  return (
    <section className="w-full h-screen px-5 py-5 flex flex-col items-center justify-around">
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="w-full flex flex-col items-center justify-center h-screen text-center">
          <h1 className="font-bold text-4xl text-neutral-900">
            Select a Youtube Playlists
          </h1>
          <div className="w-full flex flex-col items-center justify-center h-[600px] overflow-y-scroll">
            <List
              sx={{
                height: "100%",
                width: "100%",
                maxWidth: 500,
                bgcolor: "background.paper",
              }}
            >
              {youtubePlaylists.map((item, i) => (
                <div
                  key={i}
                  className="hover:cursor-pointer hover:bg-neutral-300 flex items-center justify-center"
                >
                  <ListItem
                    alignItems="center"
                    onClick={() => {
                      openYTPlaylist(item);
                    }}
                  >
                    <img
                      alt={item.snippet.title}
                      src={item.snippet.thumbnails.high.url}
                      className="w-2/6 aspect-auto mx-4"
                    />
                    <ListItemText
                      primary={item.snippet.title}
                      secondary={
                        <Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {item.snippet.description || "No Description"}
                          </Typography>
                          {item.snippet.description}
                        </Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              ))}
            </List>
          </div>
          <div className="w-full max-w-[500px] flex justify-between items-center my-10">
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                navigate("/");
              }}
            >
              Back
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default YoutubePlaylists;
