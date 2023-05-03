const { Router } = require('express');
const router = Router();
const api = require('./api');
const authentication = require('./middleware/authentication');

router.put('/api/users/user', api.signup_post);
router.post('/api/authentification', api.login_post);
router.get('/api/users', authentication, api.get_users);
router.get('/api/users/:user_id', authentication, api.get_user)
router.put('/api/users/:user_id', authentication, api.update_user)
router.delete('/api/users/:user_id', authentication, api.delete_user)
// Get all tweets
router.get('/api/posts', authentication, api.get_tweets)
// Get posts by user
router.get('/api/posts/:user_id', authentication, api.get_tweets_by_user)
// Add new post
router.post('/api/posts', authentication, api.add_post)
// Follow a user
router.post('/api/users/:user_id/follow', authentication, api.follow_user)
// Unfollow a user
router.post('/api/users/:user_id/unfollow', authentication, api.unfollow_user)
// Get all followers
router.get('/api/users/:user_id/followers', authentication, api.get_followers)
// Get all followings
router.get('/api/users/:user_id/followings', authentication, api.get_followings)
// Commenting on a post
router.post('/api/posts/:post_id/comments', authentication, api.post_comment)
// Delete a comment
router.delete('/api/posts/:post_id/:comment_id', authentication, api.delete_comment)
// Delete a post
router.delete('/api/posts/:post_id', authentication, api.delete_post)
// Like a post
router.post('/api/posts/:post_id/like', authentication, api.like_post)
// Unlike a post
router.post('/api/posts/:post_id/unlike', authentication, api.unlike_post)
// Add a post to favourites
router.post('/api/posts/:post_id/addFavourite', authentication, api.add_to_favourites)
// Delete a post from favourites
router.post('/api/posts/:post_id/deleteFavourite', authentication, api.delete_from_favourites)
// Get favourites by user id
router.get('/api/posts/:user_id/favourites', authentication, api.get_favourites)

// Upload profile image
router.post('/api/image/:user_id', authentication, api.add_image)
// Add profile Bio
router.post('/api/bio/:user_id', authentication, api.add_bio)
// Get number of following
router.get('/api/users/:user_id/following', authentication, api.get_following)

// router.get('/generateToken', authController.generateToken);

module.exports = router;
