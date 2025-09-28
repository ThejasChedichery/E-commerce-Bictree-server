const UserData = require('../Model/UserModel');
const bcrypt = require('bcryptjs');

// Register user
const Register = async (req, res) => {
    try {
        const { userName, email, password, role } = req.body;
        
        const existingUser = await UserData.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userData = new UserData({
            userName,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        const savedUser = await userData.save();
        res.status(201).send({ 
            message: "User registered successfully", 
            user: {
                id: savedUser._id,
                userName: savedUser.userName,
                email: savedUser.email,
                role: savedUser.role
            }
        });
    } catch (err) {
        res.status(500).send({ message: 'Cannot register user', err });
    }
};

// Login user
const Login = async (req, res) => {
    try {
        res.status(200).send({ 
            message: "Login successful", 
            user: req.user 
        });
    } catch (err) {
        res.status(500).send({ message: 'Cannot login user', err });
    }
};

module.exports = { Register, Login };