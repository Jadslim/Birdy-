import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
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
import HomeIcon from '@mui/icons-material/Home';
import Person2Icon from '@mui/icons-material/Person2';
import MessageIcon from '@mui/icons-material/Message';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import Button from '@mui/material/Button';
import PostComponent from '../components/PostComponent';
import { logout } from '../services/auth.service';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { addProfileBio, addProfileImage, followUser, getFollowers, getFollowings, getUserById, unfollowUser } from '../services/user.service';
import { getDecodedToken } from '../common/auth';
import TweetComponent from '../components/TweetComponent';
import { getPosts, getPostsByUser } from '../services/post.service';
import style from "./ProfilePage.css";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import emptyPhoto from "../images/Profile.png"
import ReactRoundedImage from "react-rounded-image"
import { Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import BookmarkIcon from '@mui/icons-material/Bookmark';

const drawerWidth = 240;


function ProfilePage(props) {
  const [posts, setPosts] = useState();
  const [user, setUser] = useState();
  const [profile, setProfile] = useState();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);
  const [followersUsers, setFollowersUsers] = useState();
  const [followingsUsers, setFollowingsUsers] = useState();
  const [image, setImage] = useState("");
  const { profile_id } = useParams();
  const [bio, setBio] = useState("");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleImageUpload = async() => {
    await addProfileImage(user._id, {
      "image": image
    })
    getUserById(profile_id).then(function(data){setProfile(data)})
  };

  const handleBioUpload = async() => {
    const bioUpload = {
      "bio": bio
    }
    await addProfileBio(user._id, bioUpload)
    alert("Bio Updated")
  }
  
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login")
  }
  useEffect(()=>{
    const decoded_token = getDecodedToken();
    const user_id = decoded_token.userId;
    getUserById(user_id).then(function(data){setUser(data)})
    getUserById(profile_id).then(function(data){setProfile(data)})
    getPostsByUser(profile_id).then(function(data){setPosts(data)})
    getFollowers(profile_id).then(function(data){setFollowersUsers(data)})
    getFollowings(profile_id).then(function(data){setFollowingsUsers(data)})
    },[])

  useEffect(()=>{
    console.log(user)
  }, [user])
  
  useEffect(()=>{
    if (user && profile){ 
      if (user._id === profile._id){
        setIsUser(true)
      } 
    }
    if (profile){
      setFollowers(profile.followers.length)
      setFollowings(profile.followings.length)
      setImage(profile.image)
    }
  }, [profile])
  const update = () => {
    getPostsByUser(profile_id).then(function(data){setPosts(data)})
  }

  useEffect(() => {
    console.log(isUser)
  }, [isUser])
  useEffect(() => {
    console.log(posts)
  }, [posts])
  
  useEffect(() => {
    console.log(followers)
  }, [followers])

  useEffect(() => {
    console.log(image)
  }, [image])

  useEffect(()=>{
    console.log(followersUsers)
  }, [followersUsers])

  useEffect(()=>{
    console.log(followingsUsers)
  }, [followingsUsers])

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
          <div style={{ marginRight: "20px" , marginLeft:"7px" }}>
            <ReactRoundedImage
              image={user.image}
              roundedColor="#FFFFFF"
              imageWidth="40"
              imageHeight="40"
              roundedSize="6"
              hoverColor="#1DA1F2"
            />
          </div>
        ) : (
          <div style={{ marginRight: "20px" , marginLeft:"7px"}}>
            <ReactRoundedImage
              image={emptyPhoto}
              roundedColor="#FFFFFF"
              imageWidth="40"
              imageHeight="40"
              roundedSize="6"
              hoverColor="#1DA1F2"
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    const img = await convertBase64(file)
    setImage(img)
  }
  const convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = (() => {
              resolve(fileReader.result);
          });
          fileReader.onerror = ((error) => {
              reject(error);
          });
      })

  } 

  const handleFollow = async() => {
    const follower = {
        "follower_id": user._id
    }
    await followUser(profile._id, follower)
    getUserById(profile_id).then(function(data){setProfile(data)})
  }

  const handleUnfollow = async() => {
    const follower = {
      "follower_id": user._id
    }
    await unfollowUser(profile._id, follower)
    getUserById(profile_id).then(function(data){setProfile(data)})
  }

  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
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
          sx={{ mt: 10, flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          {/* flexGrow: 2, p: 15, width: { sm: `calc(100% - ${drawerWidth}px)` } */}
          {/* <Toolbar /> */}
          <div className="tweetBox"  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ width: 900 }}>
              <Typography style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingLeft: '10px', fontSize: '20px' }}>
                {
                  profile 
                  ?
                  <>
                    {profile.firstname} {profile.lastname}
                  </>
                  :
                  null
                }
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <div>
                      Followers: {followers}
                      <Tooltip 
                        title={
                          followersUsers?.map((follower, index) => (
                            <div>{follower.firstname} {follower.lastname}</div>
                            ))
                            
                          }
                      >
                        <IconButton>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div>
                      Following: {followings}
                      <Tooltip 
                        title={
                          followingsUsers?.map((following, index) => (
                            <div>{following.firstname} {following.lastname}</div>
                            ))
                            
                          }
                      >
                        <IconButton>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div style={{ marginTop: '12px' }}>
                    {
                      profile
                      ?
                        !isUser 
                        ?
                          profile.followers.includes(user?._id)
                          ?
                              <Button size="small" onClick={handleUnfollow}>
                                  Followed
                              </Button>
                          :
                              <Button size="small" onClick={handleFollow}>
                                  Follow
                              </Button>
                        :
                        null
                      :
                      null
                    }
                    </div>
                  </Grid>
                </Grid>
              </Box>
              <div style={{ height: "400px", marginTop: "20px", display: 'flex', justifyContent: 'space-around', marginRight: "30px", marginLeft: "30px" }}>
                <div style={{ marginLeft: "20px" }}>
                  {
                    profile 
                    ?
                      profile.image !== ""
                      ?
                      <div style={{ marginLeft: "20px" }}>
                        <ReactRoundedImage
                          image={profile.image}
                          roundedColor="#FFFFFF"
                          imageWidth="150"
                          imageHeight="150"
                          roundedSize="12"
                          hoverColor="#1DA1F2"
                        />
                      </div>
                      :
                      <div style={{ marginLeft: "20px" }}>
                        <ReactRoundedImage
                          image={emptyPhoto}
                          roundedColor="#FFFFFF"
                          imageWidth="150"
                          imageHeight="150"
                          roundedSize="12"
                          hoverColor="#1DA1F2"
                          style={{ marginLeft: "20px" }}
                        />
                      </div>
                    :
                    null
                  }
                  {
                    isUser 
                    ?
                    <>
                      <input style={{ marginTop: "20px" }} onChange={handleFileChange} type="file" className="form-control" id="image" />
                      <Button onClick={handleImageUpload}>Upload</Button>
                    </>
                    :
                    null
                  }
                  
                  
                </div>
                
                <CardContent>
                  {
                    isUser 
                    ?
                    <form>
                        <div className="tweetBox__input">
                          <textarea
                              rows={10}
                              onChange={(e) => setBio(e.target.value)}
                              // value={tweetMessage}
                              placeholder="Bio"
                              type="text"
                              defaultValue={profile?.bio}
                              style={{ width: "500px", marginTop: "-25px" }}
                          />
                        </div>
                        <Button onClick={handleBioUpload}>Update</Button>
                    </form>
                    :
                    <div style={{ width: "250px" }}>
                      <Typography>Bio:</Typography>
                      <p>{profile?.bio}</p>
                    </div>

                  }
                    
                </CardContent>

              </div>
            {/* <CardActions>
                <Button size="small">Check Quotes</Button>
            </CardActions> */}
            </Card>
          </div>
        </Box>
      </Box>
      <Box
        component="main"
        sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', marginLeft: '240px', flexWrap: 'wrap', }}
      >
        {
          posts 
          ?
          posts
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((post, i) => (
            <div key={i}>
              <TweetComponent post={post} user_id={user?._id} first_name={user?.firstname} last_name={user?.lastname} update={update}/>
            </div>
          ))
          :
          null
        }
      </Box>
      </div>
    </>
  );
}

export default ProfilePage;
