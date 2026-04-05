const jwt = require("jsonwebtoken")

const protect = (req, res, next) => {
    const authHeader = req.headers.authorizatio

    if (!authHeader|| !authHeader.starsWith("Bear")){
        return res.status(401).json({message: "No token provided, access denied"})
    }
    const token=authHeader.split("") [1]
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded= //{id, email, firstname, lastname}
        next()
    }catch(error){
        return res.status(401).json({message:"invalid or expired token"})
    }
}
module.exports = protect