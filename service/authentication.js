const JWT = require('jsonwebtoken');

// cretae a secret key
const secret = "Raj$harma@123#"


// crete a token for user
function createTokenForUser(user){
    const payload={
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role,
    }
    console.log(payload);
    const token= JWT.sign(payload,secret);
    console.log("token",token);
    return token;
}

// function or logic for  valdate token
function validateToken(token){
const payload  = JWT.verify(token,secret);
// console.log(payload);
return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
}