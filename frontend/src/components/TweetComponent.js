import React, { useEffect, useState } from "react";
import "./PostComponent.css";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { TextField } from "@mui/material";
import { getUserById } from "../services/user.service";
import { addNewComment, addPostFavourite, deleteComment, deletePost, deletePostFavourite, likePost, unlikePost } from "../services/post.service";
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import emptyPhoto from "../images/Profile.png"
import ReactRoundedImage from "react-rounded-image"
import BookmarkIcon  from '@mui/icons-material/Assignment';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';


function TweetComponent({ post, user_id, first_name, last_name, update }) {
  const [poster, setPoster] = useState();
  const [comment, setComment] = useState("");
  const [actualUser, setActualUser] = useState();
  const addComment = async() => {
    const newComment = {
        "user_id": user_id,
        "full_name": first_name + " " + last_name,
        "comment": comment
    }    
    await addNewComment(post._id, newComment);
    update();
  }

  const handlePostDelete = async() => {
    await deletePost(post._id);
    update();
  }

  const handleCommentDelete = async(comment_id) => {
    await deleteComment(post._id, comment_id)
    update();
  }
  const handleLike = async() => {
    const user = {
        "user_id": user_id
    }
    await likePost(post._id, user)
    update();
  }
  const addToFavourites = async() => {
    const user = {
        "user_id": user_id
    }
    await addPostFavourite(post._id, user)
    getUserById(user_id).then(function(data){setActualUser(data)}) 
    update();
  }

  const handleUnlike = async() => {
    const user = {
        "user_id": user_id
    }   
    await unlikePost(post._id, user)
    update();
  }

  const deleteFromFavourites = async() => {
    const user = {
        "user_id": user_id
    }
    await deletePostFavourite(post._id, user)
    getUserById(user_id).then(function(data){setActualUser(data)}) 
    update();
  }

  useEffect(() => {    
    getUserById(post.user_id).then(function(data){setPoster(data)})
    getUserById(user_id).then(function(data){setActualUser(data)}) 
  }, [])

  useEffect(() => {
    console.log(actualUser)
  }, [actualUser])
  const navigate = useNavigate();
  return (
    <div className="tweetBox"  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ width: 900 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '10px', paddingLeft: '10px', fontSize: '20px' }}>
                    {
                        poster 
                        ?
                        <>
                            {
                                poster.image === ""
                                ?
                                <div style={{ marginRight: "10px" }}>
                                    <ReactRoundedImage
                                        image={emptyPhoto}
                                        roundedColor="#FFFFFF"
                                        imageWidth="40"
                                        imageHeight="40"
                                        roundedSize="6"
                                        hoverColor="#1DA1F2"
                                    />
                                </div>
                                :
                                <div style={{ marginRight: "10px" }}>
                                    <ReactRoundedImage
                                        image={poster.image}
                                        roundedColor="#FFFFFF"
                                        imageWidth="40"
                                        imageHeight="40"
                                        roundedSize="6"
                                        hoverColor="#1DA1F2"
                                        // if user has a photo
                                    />
                                </div>
                            }  
                           
                           <NavLink 
                            to={`/profile/${poster._id}`}
                            style={{ textDecoration: 'none' ,color:"#000000",fontWeight: 'bold'}}
                            
                            >
                            {poster.firstname} {poster.lastname}
                            </NavLink>
                        </>
                        :
                        null
                    }
                </Typography>
                {
                    post.user_id === user_id 
                    ?
                    <IconButton onClick={handlePostDelete}>
                        <Delete  />
                    </IconButton>
                    :
                    null
                }
            </div>
            <CardContent>
                <Typography style={{wordWrap: 'break-word', textAlign: 'left'}}>
                    {post.content} 
                </Typography>
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
            {
                post.likes.includes(user_id)
                ?
                    <Button size="small" onClick={handleUnlike}>
                        <FavoriteIcon style={{ color: 'red' }} />
                        {post.likes.length}
                    </Button>
                :
                    <Button size="small" onClick={handleLike}>
                        <FavoriteBorderIcon />
                        {post.likes.length}
                    </Button>

            }
                
                {
                    actualUser 
                    ?
                        actualUser.favourites.includes(post._id)
                        ?
                        
                        <Button onClick={deleteFromFavourites} size="small"><BookmarkRemoveIcon   /></Button>
                        :
                        

                        <Button onClick={addToFavourites} size="small"><BookmarkAddIcon  style={{color: "grey"}} /></Button>
                    :
                    null
                    
                }

            </CardActions>
            <div style={{padding: '10px'}}>
                    <Typography variant="subtitle1" style={{fontWeight: 'bold',textAlign: 'left'}}>Comments:</Typography>
                {
                    post.comments.map((item, i) => (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
                                <NavLink
                                to={`/profile/${item.user_id}`}
                                style={{ textDecoration: 'none' }}
                                >
                                <Typography variant="body1" style={{marginRight: '10px', fontWeight: 'bold',color:"#000000"}}>
                                    {item.full_name}:
                                </Typography>
                                </NavLink>
                                <Typography variant="body1">{item.comment}</Typography>
                            </div>
                            {
                                item.user_id === user_id
                                ?
                                <Button variant="contained" color="error" style={{ marginTop: '10px', width: '10px', minWidth: '10px', height: '15px' }} onClick={() => handleCommentDelete(item._id)}>X</Button>    
                                :
                                null
                            }
                        </div>
                    ))
                }
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <TextField label="Add a comment" variant="outlined" size="small" onChange={(e) => setComment(e.target.value)} fullWidth />
                    <Button onClick={addComment} variant="contained" color="primary">Comment</Button>
                </div>
            </div>
        </Card>
    </div>
  );
}

export default TweetComponent;