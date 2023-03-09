const userModel = require('../models/userModel');
const validate = require('validator');
const jwt = require('jsonwebtoken');

let valid = function (value) {
    if (typeof value == "undefined" || typeof value == null || typeof value === "number" || value.trim().length == 0) {
        return false
    }
    if (typeof value == "string") {
        return true
    }
    return true
}


const userRegister = async function (req, res) {
    const data = req.body;

    if (Object.keys(data).length === 0) {
        return res.status(400).send({ status: false, message: "Body can't be empty" });
    }

    if (!data.fname) {
        return res.status(400).send({ status: false, message: "first name can't be empty" })
    }

    if (!valid(data.fname)) {
        return res.status(400).send({ status: false, message: "Use alphabets only" })
    }

    if (!data.lname) {
        return res.status(400).send({ status: false, message: "last name can't be empty" })
    }
    if (!valid(data.lname)) {
        return res.status(400).send({ status: false, message: "Use alphabets only" })
    }


    if (!data.mobile) {
        return res.status(400).send({ status: false, message: "Mobile can't be empty" })
    }

    //^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$
    // /^([+]\d{2})?\d{10}$/

    const validPhone = /^([+]\d{2})?\d{10}$/.test(data.mobile);

    if (!validPhone) {
        return res.status(400).send({ status: false, message: "Invalid Mobile number." })

    }


    const checkMobile = await userModel.findOne({ mobile: data.mobile });
    if (checkMobile) {
        return res.status(400).send({ status: false, message: "Mobile number already exists." })
    }

    if (!data.email) {
        return res.status(400).send({ status: false, message: "Email can't be empty" })
    }
    const emailId = data.email;
    const emailValidate = validate.isEmail(emailId);

    if (!emailValidate) {
        return res.status(400).send({ status: false, message: "Invalid Email" })

    }

    const checkEmail = await userModel.findOne({ email: data.email });
    if (checkEmail) {
        return res.status(400).send({ status: false, message: "Email already exists." })
    }
    if (!data.password) {
        return res.status(400).send({ status: false, message: "Password can't be empty" })
    }

    const user = await userModel.create(data);

    return res.status(200).send({ status: true, message: "User created sucessfully", data: user })

}



const loginUser = async function (req, res) {

    const data = req.body;

    if (Object.keys(data).length === 0) {
        return res.status(400).send({ status: false, message: "Body can't be empty" })
    }

    if (!data.email) {
        return res.status(400).send({ status: false, message: "Email can't be empty" })
    }
    if (!data.password) {
        return res.status(400).send({ status: false, message: "Password can't be empty" })
    }

    const checkUser = await userModel.findOne({ email: data.email, password: data.password }).select({ _id: 1 });

    if (!checkUser) {
        return res.status(400).send({ status: false, message: "Email or password is not correct." })
    }


    let token = jwt.sign({
        userId: checkUser._id
    }, "secret_key");

    return res.status(200).send({ status: true, message: "User logged-in sucessfully", data: { _id: checkUser._id, token: token } })
}


const udpdateUser = async function (req, res) {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).send({ status: false, message: "Please give userId." })
    }

    const userCheck = await userModel.findById({ _id: userId });
    if (!userCheck) {
        return res.status(400).send({ status: false, message: "UserId is not matching." })
    }

    const userData = req.body;

    if (!(userData.fname || userData.lname || userData.mobile || userData.email || userData.password)) {
        return res.status(400).send({ status: false, message: "Please give data to update." })
    }

    const validEmail = validate.isEmail(userData.email);
    if (!validEmail) {
        return res.status(400).send({ status: false, message: "Please give valid email to update." })
    }

    const validPhone = /^([+]\d{2})?\d{10}$/.test(userData.mobile);

    if (!validPhone) {
        return res.status(400).send({ status: false, message: "Please give valid mobile number to update." })

    }

    const { fname, lname, mobile, email, password } = userData;
    let dataObj = {}
    if (fname) dataObj.fname = fname;
    if (lname) dataObj.lname = lname;
    if (mobile) dataObj.mobile = mobile;
    if (email) dataObj.email = email;
    if (password) dataObj.password = password;

    const updatedUser = await userModel.findByIdAndUpdate({ _id: userId }, { $set: dataObj }, { new: true });

    if (!updatedUser) {
        return res.status(400).send({ status: false, message: "User not found." })
    }

    return res.status(200).send({ status: true, message: "User updated sucessfully", data: updatedUser });

}

const getUsers = async function (req, res) {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).send({ status: false, message: "Please give userId." })
    }

    const checkUserId = await userModel.findById({ _id: userId });
    if (checkUserId) {
        const usersData = await userModel.findById({ _id: userId }).select({ _id: 1, fname: 1, lname: 1, mobile: 1, email: 1 });
        return res.status(400).send({ status: false, message: "User data.", data: usersData });
    }
    
}

module.exports.userRegister = userRegister;
module.exports.loginUser = loginUser;
module.exports.udpdateUser = udpdateUser;
module.exports.getUsers = getUsers;