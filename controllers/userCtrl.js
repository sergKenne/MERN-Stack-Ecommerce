const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');


const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await Users.findOne({ email });
            if (user) return res.status(400).json({ msg: 'the email already exists...' });
            if (password.length < 6)
                return res.status(400).json({ msg: 'the password is at least 6 characters long.' });

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = new Users({
                name,
                email,
                password: passwordHash,
            });

            await newUser.save();

            //jsonwebtoken to authentication
            const accesstoken = createAccessToken({ id: newUser._id });
            const refreshtoken = createRefreshToken({ id: newUser._id });

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
            });
            return res.json({ accesstoken });
        } catch (e) {
            res.status(500).json({ msg: e.message });
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: 'Please Login or Register' });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: 'Please Login or Register' });

                const accesstoken = createAccessToken({ id: user.id });

                res.json({ accesstoken });
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

function createAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
}

function createRefreshToken(user){
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = userCtrl;