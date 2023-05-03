const User = require('./entities/User');
const Post = require('./entities/Post');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { uuid } = require('uuidv4');
const Utils = require('./utils')

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { login: '', duplicate: '' };
  
    // duplicate email or username error
    if (err.code === 11000) {
      errors.duplicate = 'Ce login est déjà utilisé';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }

// function to create a token
const createToken = async (req, user, now, maxAge) => {
    console.log(maxAge);
    const token = jwt.sign(
    { 
        iss : 'urn:yourDomain.tld',
        aud : 'urn:' + (req.get('origin') ? req.get('origin') : '*.yourDomain.tld'),
        // sub : user.username ,
        name : user.fullname,
        userId : user._id,
        roles : user.role,
        jti : uuid(),
        iat : now
    }, 
        'Signature', 
    {
        expiresIn: maxAge
    });
    console.log(token);
    return token;
}

exports.signup_post = async(req, res, next) => {
    const { firstname, lastname, login,  password } = req.body;
    if (!(Utils.isInputValid(firstname))) {
        res.status(400);
        res.json({ status: 400, message: "Le prénom n'est pas une entrée valide" });
        res.end();
        return;
     }

     if (!(Utils.isInputValid(lastname))) {
        res.status(400);
        res.json({ status: 400, message: "Le nom n'est pas une entrée valide" });
        res.end();
        return;
     }

     if (!(Utils.isInputValid(login))) {
        res.status(400);
        res.json({ status: 400, message: "Le login n'est pas une entrée valide" });
        res.end();
        return;
     }

     if (!(Utils.isPasswordValid(password))) {
        res.status(400);
        res.json({ status: 400, message: "Le mot de passe n'est pas une entrée valide" });
        res.end();
        return;
     }
    
    try{
        // Hashage
        req.body.password = await argon2.hash(req.body.password, {
            type: argon2.argon2id,
            memoryCost: 2**16,
            hashLength: 64,
            saltLength: 32,
            timeCost: 11,
            parallelism: 2
        });
        const saved = await User.create(req.body);
        res.status(201);
        res.json({ status: 201, message: "utilisateur créé" });
        res.end();
        return;
    } catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });       
    }
};


module.exports.login_post = async (req, res) => {
    const { login,  password } = req.body;
    User.find({login: login}).then(async (user) => {
        if (!user[0]){
            return res.status(400).send({errors: ['Invalid Credentials']});
        } else {
            if (await argon2.verify(user[0].password, password)){
                // Create JWT Token and return it
                const now = Math.floor(Date.now()/1000);
                const maxAge = 10 * 60 * 60 * 24; // 10 secondes  
                const token = await createToken(req, user[0], now, maxAge); 
                console.log(token);
                // Set the cookie with the token value
                res.cookie('accessToken', token, { maxAge: maxAge * 1000, httpOnly: true });
                res.status(200).json({ message: "Access Granted", accessToken: token });
            } else {
                return res.status(400).send({ errors: ['Invalid Credentials'] });
            }

        }
    });
}

module.exports.get_favourites = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const user = await User.findById(user_id);
    const favouritePosts = await Post.find({
      _id: { $in: user.favourites }
    }).sort({ created_at: -1 });
    res.json(favouritePosts);
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports.get_users = async (req, res, next) => {
    try{
      const users = await User.find()
      res.json(users);
    } catch (error){
      res.json({error: error})
      
    }
};

module.exports.get_user = async (req, res, next) => {
    let { user_id } = req.params;
    console.log(user_id)
    try {
        const user = await User.findOne({_id: user_id});
        res.json(user);
    }
    catch(err) {
        res.status(404).send({error: "user not found in the db"})
    }
};

module.exports.update_user = async (req, res, next) => {
    try{
        let { user_id } = req.params;
        const updated = await User.findOneAndUpdate({_id: user_id}, req.body);
        return res.status(201).send({id: updated._id});
    } catch(err) {
        res.status(404).send({error: "user not found in the db"})
        // res.status(404).send({error: err});
    }
};

module.exports.add_image = async (req, res, next) => {
  try{
    let { user_id } = req.params;

    // read the image data from the request body
    const { image } = req.body;

    // update the user object to include the image
    const filter = {_id: user_id};
    const update = {$set: {image: image}};
    const options = {new: true};
    const updated = await User.updateOne(filter, update, options);

    if (updated.nModified === 0) {
      return res.status(404).send({error: "user not found in the db"});
    }

    return res.status(201).send({image: image});
  } catch(err) {
    res.status(500).send({error: err.message});
  }
};

module.exports.add_bio = async (req, res, next) => {
  try{
    let { user_id } = req.params;

    const { bio } = req.body;

    // update the user object to include the bio
    const filter = {_id: user_id};
    const update = {$set: {bio: bio}};
    const options = {new: true};
    const updated = await User.updateOne(filter, update, options);

    if (updated.nModified === 0) {
      return res.status(404).send({error: "user not found in the db"});
    }

    return res.status(201).send({bio: bio});
  } catch(err) {
    res.status(500).send({error: err.message});
  }
};

module.exports.delete_user = async (req, res, next) => {
    try{
        let { user_id } = req.params;
        console.log(user_id);

        await User.deleteOne({_id: user_id});
        console.log('deleted');
        res.send("user with id " + user_id + " is deleted");
    } catch(err) {
        res.status(404).send({error: "user not found in the db"});
    }
    
}


// Follow a user
module.exports.follow_user = async (req, res, next) => {
  const { user_id } = req.params;
  const { follower_id } = req.body;

  try {
    const user = await User.findById(user_id);
    const follower = await User.findById(follower_id);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    if (!follower) {
      res.status(404).send('Follower not found');
      return;
    }
    user.followers.push(follower_id);
    follower.followings.push(user_id);
    await user.save();
    await follower.save();
    res.send('User followed successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error following user');
  }
};

// Unfollow a user
module.exports.unfollow_user = async (req, res, next) => {
  const { user_id } = req.params;
  const { follower_id } = req.body;

  try {
    const user = await User.findById(user_id);
    const follower = await User.findById(follower_id);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    if (!follower) {
      res.status(404).send('Follower not found');
      return;
    }
    const index = user.followers.indexOf(follower_id);
    const indexFollowing = follower.followings.indexOf(user_id);
    if (index === -1) {
      res.status(400).send('Follower has not followed this user');
      return;
    }
    if (indexFollowing === -1) {
      res.status(400).send('Follower has not followed this user');
      return;
    }
    user.followers.splice(index, 1);
    follower.followings.splice(indexFollowing, 1);
    await user.save();
    await follower.save();
    res.send('Follower unfollowed successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error unfollowing user');
  }
};

// See all followers
module.exports.get_followers = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    const followerIds = user.followers;
    const followers = await User.find({ _id: { $in: followerIds } });

    res.send(followers);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error finding followers');
  }
};


// See all followings
module.exports.get_followings = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    const followingsIds = user.followings;
    const followings = await User.find({ _id: { $in: followingsIds } });

    res.send(followings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error finding followings');
  }
};



// See all tweets
module.exports.get_tweets = async (req, res, next) => {
  try {
    const posts = await Post.find().exec();
    res.send(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error finding posts');
  }
};

// See all tweets by user
module.exports.get_tweets_by_user = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const posts = await Post.find({ user_id: user_id }).exec();
    res.send(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error finding posts');
  }
};


// Add new post
module.exports.add_post = async (req, res, next) => {
  const { user_id, content } = req.body;
  const post = new Post({ user_id, content });
  try {
    await post.save();
    res.send('Post saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving post');
  }
};

// Add a post to Favourites
module.exports.add_to_favourites = async (req, res, next) => {
  const { post_id } = req.params;
  const { user_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    user.favourites.push(post_id);
    await user.save();
    res.send('Post added to favourites successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding post to Favourites');
  }
};

// Delete a post from Favourites
module.exports.delete_from_favourites = async (req, res, next) => {
  const { post_id } = req.params;
  const { user_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    const index = user.favourites.indexOf(post_id);
    if (index === -1) {
      res.status(400).send('User has not added this post to favourites');
      return;
    }

    user.favourites.splice(index, 1);
    await user.save();
    res.send('Post deleted successfully from favourites');

  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting post from Favourites');
  }
};


// Like a post
module.exports.like_post = async (req, res, next) => {
  const { post_id } = req.params;
  const { user_id } = req.body;

  try {
    const post = await Post.findById(post_id);
    const user = await User.findById(user_id);
    if (!post) {
      res.status(404).send('Post not found');
      return;
    }
    post.likes.push(user_id);

    // update the likes received for the user
    var filter = {_id: post.user_id};
    var update = { $inc: { likesreceived: 1 } };
    var options = {new: true};
    var updated = await User.updateOne(filter, update, options);

    // update the likes given for the user
    var filter = {_id: user_id};
    var update = { $inc: { likesgiven: 1 } };
    var options = {new: true};
    var updated = await User.updateOne(filter, update, options);
    
    await post.save();

    res.send('Post liked successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error liking post');
  }
};

// Unlike a post
module.exports.unlike_post = async (req, res, next) => {
  const { post_id } = req.params;
  const { user_id } = req.body;

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      res.status(404).send('Post not found');
      return;
    }
    const index = post.likes.indexOf(user_id);
    if (index === -1) {
      res.status(400).send('User has not liked this post');
      return;
    }

    // update the likes received for the user
    var filter = {_id: post.user_id};
    var update = { $inc: { likesreceived: -1 } };
    var options = {new: true};
    var updated = await User.updateOne(filter, update, options);

    // update the likes received for the user
    var filter = {_id: user_id};
    var update = { $inc: { likesgiven: -1 } };
    var options = {new: true};
    var updated = await User.updateOne(filter, update, options);

    post.likes.splice(index, 1);
    await post.save();
    res.send('Post unliked successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error unliking post');
  }
};

// Delete a post
module.exports.delete_post = async(req, res, next) => {
  const { post_id } = req.params;
  try {
    await Post.findByIdAndDelete(post_id); // Find and delete the post by post_id
    res.send('Post deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting post');
  }
}

// Delete a comment
module.exports.delete_comment = async(req, res, next) => {
  const { post_id, comment_id } = req.params;
  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Find the comment by its ID
    const comment = post.comments.find(comment => comment.id === comment_id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    // Remove the comment from the post's comments array
    post.comments = post.comments.filter(comment => comment.id !== comment_id);
    await post.save();

    res.send('Comment deleted successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}


// Commenting on a post
module.exports.post_comment = async (req, res, next) => {
  const { user_id, full_name, comment } = req.body;
  const { post_id } = req.params;

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    post.comments.push({
      user_id: user_id,
      full_name: full_name,
      comment: comment
    });

    await post.save();
    res.send('Comment saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving comment');
  }
};

// Get number of following for a user
module.exports.get_following = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    post.comments.push({
      user_id: user_id,
      full_name: full_name,
      comment: comment
    });

    await post.save();
    res.send('Comment saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving comment');
  }
};

