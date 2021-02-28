const jwt = require("jsonwebtoken");

const generateTokens = user => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1hr" }
  );
  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_JWT_SECRET,
    { expiresIn: "1d" }
  );
  console.log("accesstoken", accessToken)

  return {accessToken, refreshToken}
};

const verifyToken =(token, key)=>{
    let decoded
    console.log("token", token)
    if(key=='access'){
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } else if (key=='refresh'){
        decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET)
    }
    if(!decoded) return new Error
    return decoded
};

module.exports = {generateTokens,verifyToken}
