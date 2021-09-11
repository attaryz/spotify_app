import React, { useEffect, useState } from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import { accessToken, logout, getCurrentUserProfile } from "./spotify";
import { catchErrors } from "./utils";
import { Login, Profile, TopArtists, TopTracks, Playlists } from "./pages";
import { GlobalStyle } from "./styles";

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

function ScrollToTop() {
  const { pathName } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathName]);
  return null;
}

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
      console.log(data);
    };
    catchErrors(fetchData());
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <header>
        {!token ? (
          <Login />
        ) : (
          <div>
            <StyledLogoutButton onClick={logout}>Logout</StyledLogoutButton>
            <Router>
              <ScrollToTop />
              <Switch>
                <Route path="/top-artists">
                  <TopArtists />
                </Route>
                <Route path="/top-tracks">
                  <TopTracks />
                </Route>
                <Route path="/playlists/:id">
                  <h1>Playlist</h1>
                </Route>
                <Route path="/playlists">
                  <Playlists />
                </Route>
                <Route path="/">
                  <div>
                    <Profile />
                  </div>
                </Route>
              </Switch>
            </Router>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
