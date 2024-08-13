import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
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
import { useDispatch } from "react-redux";
import { setPlaylist } from "@/redux/slices";
import Link from "next/link";

const PlaylistTable = (props: {
  playlists: {
    title: string;
    image: string;
    description: string;
    owner: string;
    totalItems: number;
    originalObject: any;
  }[];
  platform: string;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const openSPPlaylist = (item: any, title: string) => {
    dispatch(setPlaylist({ ...item, playlistTitle: title }));
    router.push("/convert/spotify");
  };

  const openYTPlaylist = (item: any, title: string) => {
    dispatch(setPlaylist({ ...item, playlistTitle: title }));
    router.push("/convert/youtube");
  };

  return (
    <section className="w-full h-screen px-5 py-5 flex flex-col items-center justify-around">
      <div className="flex w-1/2 min-w-fit max-w-lg flex-col items-center justify-center h-5/6 text-center">
        <Card className="dark">
          <CardHeader>
            <CardTitle>Select a {props.platform} Playlist</CardTitle>
            <CardDescription>
              Select the playlist that you would like to convert
            </CardDescription>
          </CardHeader>
          <CardContent className="relative h-[400px] overflow-y-auto">
            <Table className="border rounded-lg">
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="w-[100px]">Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {props.playlists.map((item, i: number) => (
                  <TableRow
                    key={i}
                    className="cursor-pointer text-left"
                    onClick={() =>
                      props.platform == "Youtube"
                        ? openYTPlaylist(item.originalObject, item.title)
                        : openSPPlaylist(item.originalObject, item.title)
                    }
                  >
                    <TableCell className="flex justify-center">
                      <img
                        alt={item.title}
                        src={item.image}
                        className="w-full aspect-square rounded-md"
                      />
                    </TableCell>
                    <TableCell className="text-left">{item.title}</TableCell>
                    <TableCell className="text-left">
                      {item.totalItems}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="w-full flex flex-row items-end justify-between my-5">
              <Link href={"/dashboard"}>
                <Button variant={"destructive"}>Back</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default PlaylistTable;
