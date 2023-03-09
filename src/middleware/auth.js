const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authentication = async function (req, res, next) {
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
};

const authorization = async function (req, res, next) {
    
    let userId = req.params.userId;

    let User = await userModel.findById({ _id: userId });
    if (!User) {
        return res.status(400).send({ status: false, message: "User doesn't exist" });
    }

    if (User != userId) {
        return res.status(400).send({ status: false, message: "Not authorized" })
    }
    next();
};

module.exports.authentication = authentication;
module.exports.authorization = authorization;