"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const YoutubePlaylist = () => {
  const user = useSelector((state: any) => state.store.user);
  const playlist = useSelector((state: any) => state.store.currentPlaylist);
  const [playlistItems, setPlaylistItems] = useState<any[]>([]);
  const [checked, setChecked] = useState<any[]>([]);
  const [checkedPlaylistItems, setCheckedPlaylistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [converted, setConverted] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [allSelected, setAllSelected] = useState(true);
  const router = useRouter();

  const convertYTPlaylist = () => {
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
        }
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

  const fetchYTPlaylist = () => {
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
        }
      )
      .then((response) => {
        console.log(response);
        setPlaylistItems(response.data.items);
        setLoading(false);
      });
  };

  const selectAllItems = () => {
    const keys = Object.keys(playlistItems);
    if (allSelected) {
      setChecked(playlistItems.map((item) => 0));
      setCheckedPlaylistItems([]);
      setAllSelected(false);
    } else {
      setChecked(playlistItems.map((item) => 1));
      setCheckedPlaylistItems([...playlistItems]);
      setAllSelected(true);
    }
  };

  const handleToggle = (index: number) => () => {
    const newChecked = [...checked];
    if (newChecked[index] === 1) {
      newChecked[index] = 0;
    } else {
      newChecked[index] = 1;
    }
    setCheckedPlaylistItems(
      newChecked
        .map((value: number, i: number) => {
          if (value === 1) return playlistItems[i];
        })
        .filter((value: number) => value !== undefined)
    );
    setChecked(newChecked);
    console.log(checkedPlaylistItems);
  };

  useEffect(() => {
    if (playlist) {
      console.log("GETTING PLAYLIST ITEMS FOR SELECTED PLAYLIST....");
      fetchYTPlaylist();
      setLoading(false);
      selectAllItems();
      console.log(playlistItems);
    } else {
      router.replace("/playlists");
    }
  }, [playlist]);

  return converted ? (
    <section className="w-full h-screen px-5 py-5 flex flex-col items-center justify-around">
      <Card className="dark">
        <CardHeader>
          <CardTitle>Successfully MUVED</CardTitle>
          <CardDescription>
            Click the button below to go to your new playlist.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <Link href={"/playlists"}>
            <Button variant={"destructive"}>Back</Button>
          </Link>
          <Link href={playlistUrl} target="_blank">
            <Button>Go to Playlist</Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  ) : (
    <section className="w-full h-screen px-5 py-5 flex flex-col items-center justify-around">
      {loading ? (
        "Loading..."
      ) : (
        <div className="flex w-1/2 min-w-fit max-w-lg flex-col items-center justify-center h-5/6 text-center">
          <Card className="dark">
            <CardHeader>
              <CardTitle>{playlist.playlistTitle || "Select Songs"}</CardTitle>
              <CardDescription>
                Select the songs you would like to move.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative h-[400px] overflow-y-auto">
              <Table className="rounded-lg border">
                <TableHeader className="w-full bg-secondary">
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        className="ml-3"
                        onCheckedChange={(checked) => selectAllItems()}
                        checked={allSelected}
                      />
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {Object.keys(playlistItems).map((key: any) => (
                    <TableRow
                      key={key}
                      className="cursor-pointer"
                      onClick={handleToggle(Number(key))}
                    >
                      <TableCell className="text-left">
                        <Checkbox
                          className="ml-3"
                          checked={checked[Number(key)] === 1}
                          onCheckedChange={handleToggle(Number(key))}
                        />
                      </TableCell>
                      <TableCell className="text-left">
                        {playlistItems[key].snippet.title}
                      </TableCell>
                      <TableCell className="text-left">
                        {playlistItems[key].snippet.videoOwnerChannelTitle}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="w-full flex flex-row items-end justify-between my-5">
                <Link href={"/playlists"}>
                  <Button variant={"outline"}>Back</Button>
                </Link>
                <Button variant={"default"} onClick={convertYTPlaylist}>
                  Convert Playlist
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </section>
  );
};

export default YoutubePlaylist;
