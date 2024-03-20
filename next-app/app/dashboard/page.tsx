"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylistTransfer } from "../redux/slices";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard = () => {
  const user = useSelector((state: any) => state.store.user);
  const [auth, setAuth] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSpotifyLogin = (playlistTransfer: any) => {
    dispatch(setPlaylistTransfer(playlistTransfer));
    window.location.href = `http://127.0.0.1:8000/spotify/login/?auth_token=${user.token}`;
  };

  useEffect(() => {
    try {
      console.log(user.username);
      console.log(user);
      setAuth(true);
    } catch (error) {
      router.replace("/login");
    }
  }, []);

  return (
    <main className="w-full h-screen p-5 flex-col">
      <Navbar />
      <div className="grid w-full grid-cols-5 gap-5 p-5 max-w-screen-lg">
        <Card className="col-span-5 p-5">
          <CardHeader>
            <CardTitle>Convert a Playlist</CardTitle>
            <CardDescription>
              Choose which platform you want to convert from and to
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row justify-center gap-10 md:gap-20">
            <Card
              className="p-10 cursor-pointer hover:grow transition-all flex justify-center items-center bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-neutral-100"
              onClick={() =>
                handleSpotifyLogin({
                  convertTo: "Youtube",
                  convertFrom: "Spotify",
                })
              }
            >
              <CardContent>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  {"Spotify -> Youtube"}
                </h3>
              </CardContent>
            </Card>
            <Card
              className="p-10 cursor-pointer hover:grow transition-all flex justify-center items-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-neutral-100"
              onClick={() =>
                handleSpotifyLogin({
                  convertTo: "Spotify",
                  convertFrom: "Youtube",
                })
              }
            >
              <CardContent>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  {"Youtube -> Spotify"}
                </h3>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
