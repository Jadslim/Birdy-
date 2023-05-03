import React, { useState } from "react";
import "./PostComponent.css";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getDecodedToken } from "../common/auth";
import { addNewPost } from "../services/post.service";

const MAX_POST_LENGTH = 300;

function PostComponent({ update }) {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState("");

  const sendTweet = async(e) => {
    e.preventDefault();
    const decoded_token = getDecodedToken();
    const user_id = decoded_token.userId;
    const newPost = {
        "user_id": user_id,
        "content": tweetMessage
    }
    await addNewPost(newPost)
    alert("Post added!")
    update();
    setTweetMessage("");
    // setTweetImage("");
  };
  const remainingCharacters = MAX_POST_LENGTH - tweetMessage.length;
  return (
    <div className="tweetBox"  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ width: 900 }}>
            <Typography style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '10px', paddingLeft: '10px', fontSize: '20px' }}>
                Add a New Post
            </Typography>
            <CardContent>
                <form>
                    <div className="tweetBox__input">
                    <textarea
                        rows={5}
                        onChange={(e) => setTweetMessage(e.target.value)}
                        value={tweetMessage}
                        placeholder="What's happening?"
                        type="text"
                        maxLength= {MAX_POST_LENGTH }
                        
                    />
                    <span style={{ color: remainingCharacters < 0 ? "red" : "inherit" }}>{remainingCharacters} characters remaining</span>
                    </div>

                    <Button
                        onClick={sendTweet}
                        type="submit"
                        className="tweetBox__tweetButton"
                    >
                    Tweet
                    </Button>
                </form>
                
            </CardContent>
        {/* <CardActions>
            <Button size="small">Check Quotes</Button>
        </CardActions> */}
        </Card>
    </div>
  );
}

export default PostComponent;