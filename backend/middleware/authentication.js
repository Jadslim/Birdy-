const jwt = require('jsonwebtoken')
const User = require('../entities/User')

const authentication = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token);
        const data = jwt.verify(token, 'Signature');
        console.log(data);
        const user = await User.findById(data.userId);
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError'){
            res.status(401).send({ error: 'JWT Expired' });
        } else {
            console.log(error);
            res.status(401).send({ error: 'Not authorized to access this resource' });
        }
        
    }

}
module.exports = authentication