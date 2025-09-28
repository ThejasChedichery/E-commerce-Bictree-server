const jwt = require('jsonwebtoken')
const UserData = require("../Model/UserModel")
const bcrypt = require('bcryptjs')

// Login validation & creating token
const LoginValidation = async (req, res, next) => {
    try {
        const findUser = await UserData.findOne({ email: req.body.email })
        if (findUser) {
            isPasswordValied = await bcrypt.compare(req.body.password, findUser.password)

            if (isPasswordValied) {
                const Token = await jwt.sign({ id: findUser._id, email: findUser.email }, process.env.JWT_SECRET || 'Seclob@2025')
                
                req.user = {
                    id:findUser._id,
                    userName:findUser.userName,
                    email:findUser.email,
                    role:findUser.role,
                    token:Token}
                next()
            }
            else {
                throw new Error('Invalid password')
            }
        }
        else {
            throw new Error('Invalid email id')
        }
    }
    catch (err) {
        res.status(500).send({ message: "can't login  " + err })
    }
}

// checking is a valied user 
const Validation = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.user?.token;

    if (!token) {
        return res.status(401).json({ message: 'Token missing or invalid' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Bictree@2025');
        req.id = decoded.id;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

// role validation
const RoleValidation = (...role) => {
    return async (req, res, next) => {
        const user = await UserData.findById(req.id)
        try {
            if (role.includes(user.role)) {
                next()
            }
            else {
                throw Error('You dont have access to this api')
            }
        } catch (err) {
            res.status(500).send({ message: "Access Denied  " + err })
        }
    }
}

module.exports = { LoginValidation, Validation, RoleValidation }