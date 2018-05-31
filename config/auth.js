const jwt = require("jsonwebtoken");

module.exports = {
    signUser: function (user) {
        const token = jwt.sign({
                Username: user.Username,
                UserId: user.UserId
            },
            "secret", {
                expiresIn: "1h"
            }
        );
        return token;
    },

    verifyUser: function (req, res, next) {
        try {
            console.log('AUTH GET')
            // console.log(req)
            // let token = req.get("Authorization").split(" ")[1];
            // console.log(token);
            // const decoded = jwt.verify(token, "secret");
            // console.log(decoded);
            // req.userData = decoded;
            next();
        } catch (err) {
            return res.status(401).json({
                message: "Auth Failed"
            });
        }
    }
};