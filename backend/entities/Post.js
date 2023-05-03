var mongoose = require('mongoose');
var { isEmail } = require('validator');
const User = require('./User');

var postSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        user_full_name: { type: String },
        content: { type: String, required: true },
        comments: {
            type: [{
                user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                full_name: { type: String, required: true },
                comment: { type: String, required: true }
            }],
            default: []
        },
        likes: {
            type: [String], 
            default: []
        },
        created_at: {
            type: Date, 
            default: Date.Now
        },
        updated_at: {
            type: Date, 
            default: Date.Now
        },
    }
);

// Fonction de h
postSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

postSchema.set('toJSON', {virtuals: true});

// fire a function before doc saved to db (hash the password)
postSchema.pre('save', async function(next){
    var currentDate = new Date();
    const user = await User.findById(this.user_id);
    this.user_full_name = `${user.firstname} ${user.lastname}`;
    this.updated_at = currentDate;
    if (!this.created_at){
        this.created_at = currentDate
    }
    next(); //appeler le prochain trigger
});


// fire a function after doc saved to db
postSchema.post('save', function(doc, next){
    console.log('new post was created & saved', doc);
    next();
});

// fire a function before doc updated 
postSchema.pre('findOneAndUpdate', function(next){
    var currentDate = new Date();
    this.set({ updated_at: currentDate });
    next(); //appeler le prochain trigger
});

// fire a function after doc updated
postSchema.post('findOneAndUpdate', function(doc, next){
    console.log('post was updated & saved', doc);
    next();
});

const Post = mongoose.model('post', postSchema);
module.exports = Post;
