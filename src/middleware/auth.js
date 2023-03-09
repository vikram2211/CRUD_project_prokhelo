const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authentication = async function (req, res, next) {
    try {
        const token = req.headers['x-api-key'];
        if (!token) {
            return res.status(400).send({ status: false, message: "Please provide tokrn in request headers." })
        }
        let verifiedToken = jwt.verify(token, "secret_key");

        if (!verifiedToken) {
            return res.status(400).send({ status: false, message: "Please provide valid token." })
        }
        if (req.params.userId) {
            if (verifiedToken.userId === req.params.userId) return next();
            else return res.status(401).send({ status: false, message: "Unauthorised!!!" });

        }
    } catch (error) {
        return res.status(500).send({ status: false, message: err.message })
    }

};

const authorization = async function (req, res, next) {
    try {
        let userid = req.params.userId;
        console.log(userid)

        let User = await userModel.findById({ _id: userid }).select({ _id: 1 });
        console.log(User);
        if (!User) {
            return res.status(400).send({ status: false, message: "User doesn't exist" });
        }

        if (User != userid) {
            return res.status(400).send({ status: false, message: "Not authorized" })
        }
        next();
    } catch (error) {
        return res.status(500).send({ status: false, message: err.message })
    }

};

module.exports.authentication = authentication;
module.exports.authorization = authorization;