import React, { useState, useEffect } from "react";
import { catchErrors } from "../utils";
import { getTopArtists } from "../spotify";
import { ArtistGrid, SectionWrapper, TimeRangeButtons } from "../components";

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState("short");

  useEffect(() => {
    const fetchData = async () => {
      const userTopArtists = await getTopArtists(`${activeRange}_term`);
      setTopArtists(userTopArtists.data);
    };
    catchErrors(fetchData());
  }, [activeRange]);
  return (
    <div>
      <main>
        {topArtists && (
          <SectionWrapper title="Top Artist" breadcrumb="true">
            <TimeRangeButtons
              activeRange={activeRange}
              setActiveRange={setActiveRange}
            />
            <ArtistGrid artists={topArtists.items} />
          </SectionWrapper>
        )}
      </main>
    </div>
  );
};
export default TopArtists;
