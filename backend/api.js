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
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    user.followers.push(follower_id);
    await user.save();
    res.send('User followed successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error following user');
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

// Commenting on a post
module.exports.post_comment = async (req, res, next) => {
  const { user_id, comment } = req.body;
  const { post_id } = req.params;

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    post.comments.push({
      user_id: user_id,
      comment: comment
    });

    await post.save();
    res.send('Comment saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving comment');
  }
};

