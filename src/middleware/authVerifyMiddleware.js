const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers["token"];

    // if (!token) {
    //   return res.status(401).json({
    //     status: "fail",
    //     message: "Token is missing",
    //   });
    // }
// console.log(req.headers);

    jwt.verify(token, "123456789", (err, decoded) => {
      
      
        if(err){
            // console.log(err);
        return res.status(401).json({
          status: "fail",
          message: "Unauthorized",
        })
      }else{
        //  console.log("Decoded token:", decoded);
        let email = decoded.data;
        req.headers.email = email;
        next();
      }
    });
}