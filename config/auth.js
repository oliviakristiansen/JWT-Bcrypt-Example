const jwt = require("jsonwebtoken");
const models = require("../models")

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
            let token = req.cookies.jwt;
            console.log(token);
            const decoded = jwt.verify(token, "secret");
            console.log(decoded);
            req.userData = decoded;
            models.users.findOne({
                where: {
                    UserId: decoded.UserId
                }
            }).then(user => {
                console.log(user.UserId)
                req.user = user;
                next();
            })
        } catch (err) {
            return res.status(401).json({
                message: "Auth Failed"
            });
        }
    }
};