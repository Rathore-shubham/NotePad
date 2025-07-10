const User = require('../models/User');
const jwt = require('jsonwebtoken')


const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: '3d'
    })
}

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    const profileImage = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'email already exist'});

    const newUser = await User.create({ username, email, password, profileImage});
    const token = generateToken(newUser._id)
    res.status(200).json({
    user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profileImage: newUser.profileImage, 
    },
    token: generateToken(newUser._id),
    });

};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user || ! (await user.comparePassword(password))){
        return res.status(400).json({ message: 'please sign up first' })
    }

    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username: user.username, email}})

}