const {userModel} = require('../../models/user.js');

module.exports = {
    login: async (req, res) => {
        const {email, password} = req.body;

        const validationResult = await validate(email);
        if (!validationResult) {
            return res.status(400).json({errorMessage: 'INVALID_EMAIL'});
        }

        if (!password) {
            return res.status(400).json({errorMessage: 'NULL_PARAMETER'});
        }

        if (password.length < 6) {
            return res.status(400).json({errorMessage: 'INVALID_PASSWORD'});
        }

        try {
            let user = await userModel.findOne({email});
            if (!user) {
                return res.status(400).json({errorMessage: 'INCORRECT_EMAIL'});
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(400).json({errorMessage: 'INCORRECT_PASSWORD'});
            }
            if (user.userType != 'Admin') {
                return res.status(403).json({errorMessage: 'UNAUTHORIZED_USER'});
            }
            const token = createToken(user._id, 'admin');
            res.status(200).json({user, token});
        } catch(error) {
            res.status(400).json(error);
        }
    },
}

function createToken(userId, userType) {
    const token = jwt.sign({
        userId,
        userType
    }, process.env.JWT_SECRET,
    {
        expiresIn: 1 * 60 * 60
    });

    return token;
}