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
// Add new post
router.post('/api/posts', authentication, api.add_post)
// Follow a user
router.post('/api/users/:user_id/follow', authentication, api.follow_user)
// Get all followers
router.get('/api/users/:user_id/followers', authentication, api.get_followers)
// Commenting on a post
router.post('/api/posts/:post_id/comments', authentication, api.post_comment)


// router.get('/generateToken', authController.generateToken);

module.exports = router;
