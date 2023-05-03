import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import Person2Icon from '@mui/icons-material/Person2';
import MessageIcon from '@mui/icons-material/Message';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import Button from '@mui/material/Button';
import PostComponent from '../components/PostComponent';
import { logout } from '../services/auth.service';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUserById } from '../services/user.service';
import { getDecodedToken } from '../common/auth';
import TweetComponent from '../components/TweetComponent';
import { getPosts, getPostsByUser } from '../services/post.service';
import { Card, CardActions, CardContent, Grid, TextField } from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AssignmentIcon from '@mui/icons-material/Assignment';
import emptyPhoto from "../images/Profile.png"
import ReactRoundedImage from "react-rounded-image"
import BookmarkIcon from '@mui/icons-material/Bookmark';



const drawerWidth = 240;

function StatsPage(props) {
  const [user, setUser] = useState();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [search, setSearch] = useState("");
  const [dateJoined, setDateJoined] = useState();
  const [totalPosts, setTotalPosts] = useState(0);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login")
  }
  useEffect(()=>{
        const decoded_token = getDecodedToken();
        const user_id = decoded_token.userId;
        getUserById(user_id).then(function(data){setUser(data)})
        getPostsByUser(user_id).then(function(data){setTotalPosts(data.length)})
    },[])

  useEffect(()=>{
    console.log(user)
    const date = new Date(user?.created_at);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    setDateJoined(formattedDate);
  }, [user])

  useEffect(()=>{
    console.log(totalPosts)
  }, [totalPosts])

  useEffect(()=>{
    console.log(dateJoined)
  }, [dateJoined])

  const getPath = (index) => {
    switch (index) {
      case 0:
        return "/home";
      case 1:
        return user ? `/profile/${user._id}` : "/profile";
      case 2:
        return "/stats";
      case 3:
        return "/favourites";
      default:
        return "/";
    }
  };
 
  const drawer = (
    <div>
      <div style={{ display: "flex", alignItems: "center", height: "65px", marginBottom: "10px" }}>
        {user && user.image ? (
          <div style={{ marginRight: "20px", marginLeft:"7px" }}>
            <ReactRoundedImage
              image={user.image}
              roundedColor="#FFFFFF"
              imageWidth="40"
              imageHeight="40"
              roundedSize="6"
              hoverColor="#1DA1F2"
            />
          </div>
        ):(
          <div style={{ marginRight: "20px", marginLeft:"7px" }}>
            <ReactRoundedImage
              image={emptyPhoto}
              roundedColor="#FFFFFF"
              imageWidth="40"
              imageHeight="40"
              roundedSize="6"
              hoverColor="#1DA1F2"
              style={{ marginLeft: "20px" }}
            />
          </div>
        )}
  
        {user && (
          <Typography style={{ display: "flex", alignItems: "center" }}>
            {user.firstname} {user.lastname}
          </Typography>
        )}
      </div>
  
      <Divider />
  
      <List>
        {["Home", "Profile", "Stats", "Favourites"].map((text, index) => (
          <NavLink to={getPath(index)} style={{ textDecoration: "none" }}>
            <ListItemButton disableRipple>
              <ListItemIcon>
                {index === 0 ? <HomeIcon /> : null}
                {index === 1 ? (user ? <Person2Icon /> : <Person2Icon />) : null}
                {index === 2 ? <QueryStatsIcon /> : null}
                {index === 3 ? <BookmarkIcon /> : null}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </NavLink>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Birdy
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        style={{ marginTop: "50px" }}
      >
        <div className="tweetBox"  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ width: 900 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '10px', paddingLeft: '10px', fontSize: '20px' }}>
                        Your Stats:
                    </Typography>
                    
                </div>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <p>Followers: {user?.followers.length}</p>
                        </Grid>
                        <Grid item xs={4}>
                            <p>Following: {user?.followings.length}</p>
                        </Grid>
                        <Grid item xs={4}>
                            <p>Likes Given: {user?.likesgiven || 0}</p>
                        </Grid>
                        <Grid item xs={4}>
                            <p>Likes Received: {user?.likesreceived || 0}</p>
                        </Grid>
                        <Grid item xs={4}>
                            <p>Posts created: {totalPosts}</p>
                        </Grid>
                        <Grid item xs={4}>
                            <p>Date Joined: {dateJoined}</p>
                        </Grid>
                </Grid>
                </CardContent>
            </Card>
        </div>
      </Box>
    </Box>
  );
}

export default StatsPage;