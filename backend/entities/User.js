var mongoose = require('mongoose');
var { isEmail } = require('validator');

var userSchema = new mongoose.Schema(
    {
        firstname: {type:String, required:[true, 'Please enter a first name']},
        lastname: {type:String, required:[true, 'Please enter a last name']},
        login: {type:String, required:[true, 'Please enter a login']},
        password: {
            type:String,
            required: [true, "Please enter a password"]
        },
        followers: {
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
userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

userSchema.set('toJSON', {virtuals: true});

// fire a function before doc saved to db (hash the password)
userSchema.pre('save', function(next){
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at){
        this.created_at = currentDate
    }
    next(); //appeler le prochain trigger
});


// fire a function after doc saved to db
userSchema.post('save', function(doc, next){
    console.log('new user was created & saved', doc);
    next();
});

// fire a function before doc updated 
userSchema.pre('findOneAndUpdate', function(next){
    var currentDate = new Date();
    this.set({ updated_at: currentDate });
    next(); //appeler le prochain trigger
});

// fire a function after doc updated
userSchema.post('findOneAndUpdate', function(doc, next){
    console.log('user was updated & saved', doc);
    next();
});

const User = mongoose.model('user', userSchema);
module.exports = User;
