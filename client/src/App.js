import React, { useEffect, useState } from "react";
import {
  Link,
  Switch,
  BrowserRouter as Router,
  Route,
  useLocation,
} from "react-router-dom";
import { accessToken, logout, getCurrentUserProfile } from "./spotify";
import { catchErrors } from "./utils";
import { Login } from "./pages";
import { GlobalStyle } from "./styles";

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
          <Router>
            <ScrollToTop />
            <Switch>
              <Route path="/top-artists">
                <h1>Top Artists</h1>
              </Route>
              <Route path="/top-tracks">
                <h1>Top Tracks</h1>
              </Route>
              <Route path="/playlists/:id">
                <h1>Playlist</h1>
              </Route>
              <Route path="/playlists">
                <h1>Playlists</h1>
              </Route>
              <Route path="/">
                <div>
                  <button onClick={logout}>logout</button>
                  {profile && (
                    <div>
                      <h1>{profile.display_name}</h1>
                      <p>Followers: {profile.followers.total}</p>
                      {profile.images.length && profile.images[0].url && (
                        <img src={profile.images[0].url} alt="avatar" />
                      )}
                    </div>
                  )}
                </div>
              </Route>
            </Switch>
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;
