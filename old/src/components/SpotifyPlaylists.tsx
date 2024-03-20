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

const SpotifyPlaylists = () => {
  const user = useSelector((state: any) => state.store.user);
  const [loading, setLoading] = useState(true);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        setSpotifyPlaylists(response.data.items);
        setLoading(false);
      });
  };

  const openSPPlaylist = (item: any) => {
    dispatch(setPlaylist(item));
    navigate("/convert-spotify");
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
    GetSPPlaylists();
  }, []);

  return (
    <section className="w-full h-screen px-5 py-5 flex flex-col items-center justify-around">
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="w-full flex flex-col items-center justify-center h-screen text-center">
          <h1 className="font-bold text-4xl text-neutral-900">
            Select a Spotify Playlists
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
              {spotifyPlaylists.map((item, i) => (
                <div
                  key={i}
                  className="hover:cursor-pointer hover:bg-neutral-300 flex items-center justify-center"
                >
                  <ListItem
                    alignItems="center"
                    onClick={() => {
                      openSPPlaylist(item);
                    }}
                  >
                    <img
                      alt={item.name}
                      src={
                        item.images.length > 0
                          ? item.images[0].url
                          : "https://img.freepik.com/free-photo/beautiful-young-slim-woman-doing-stretching-exercises-gym-against-white_155003-17254.jpg?w=996&t=st=1703149645~exp=1703150245~hmac=ae580533990b7c9fd661e2d4edd70b28f99171b3bc925174a13a7bb349fe4776"
                      }
                      className="w-2/6 aspect-square mx-4"
                    />
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {item.owner.display_name}
                          </Typography>
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

export default SpotifyPlaylists;
