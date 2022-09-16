import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import { Home, LocalLibrary } from "@mui/icons-material";

import auth from "auth/auth-helper";

const isActive = (location: { pathname: any }, path: string) => {
  if (location.pathname === path) return { color: "#ff4081" };
  else return { color: "#ffffff" };
};

const isPartActive = (location: { pathname: any }, path: string) => {
  if (location.pathname.includes(path))
    return { color: "#fffde7", backgroundColor: "#f57c00", marginRight: 10 };
  else
    return {
      color: "#616161",
      backgroundColor: "#fffde7",
      border: "1px solid #f57c00",
      marginRight: 10,
    };
};

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          MERN Skeleton
        </Typography>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(location, "/")}>
            <Home />
          </IconButton>
        </Link>
        <Link to="/users">
          <Button style={isActive(location, "/users")}>Users</Button>
        </Link>
        {!auth.isAuthenticated() && (
          <span>
            <Link to="/signup">
              <Button style={isActive(location, "/signup")}>Sign up</Button>
            </Link>
            <Link to="/signin">
              <Button style={isActive(location, "/signin")}>Sign In</Button>
            </Link>
          </span>
        )}
        {auth.isAuthenticated() && (
          <span>
            {auth.isAuthenticated().user.educator && (
              <Link to="/teach/courses">
                <Button style={isPartActive(location, "/teach/")}>
                  <LocalLibrary /> Teach
                </Button>
              </Link>
            )}
            <Link to={"/user/" + auth.isAuthenticated().user._id}>
              <Button
                style={isActive(
                  location,
                  "/user/" + auth.isAuthenticated().user._id
                )}
              >
                My Profile
              </Button>
            </Link>
            <Button
              color="inherit"
              onClick={() => {
                auth.clearJWT(() => navigate("/"));
              }}
            >
              Sign out
            </Button>
          </span>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
