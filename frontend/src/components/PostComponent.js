import React, { useState } from "react";
import "./PostComponent.css";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function PostComponent() {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState("");

  const sendTweet = (e) => {
    e.preventDefault();

    setTweetMessage("");
    setTweetImage("");
  };

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
                    />
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