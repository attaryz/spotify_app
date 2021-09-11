import axios from "axios";
import React, { useEffect, useState } from "react";
import { PlaylistGrid, SectionWrapper } from "../components";
import { getCurrentUserPlaylists } from "../spotify";
import { catchErrors } from "../utils";

const Playlists = () => {
  const [playlistsData, setPlaylistsData] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUserPlaylists();
      setPlaylistsData(data);
    };
    catchErrors(fetchData());
  }, []);

  useEffect(() => {
    if (!playlistsData) {
      return;
    }
    const fetchMoreData = async () => {
      if (playlistsData.next) {
        const { data } = await axios.get(playlistsData.next);
        setPlaylistsData(data);
      }
    };
    setPlaylists((playlists) => [
      ...(playlists ? playlists : []),
      ...playlistsData.items,
    ]);
    catchErrors(fetchMoreData());
  }, [playlistsData]);

  return (
    <div>
      <main>
        {playlists && (
          <SectionWrapper title="Playlists" breadcrumb="true">
            <PlaylistGrid playlists={playlists} />
          </SectionWrapper>
        )}
      </main>
    </div>
  );
};

export default Playlists;
