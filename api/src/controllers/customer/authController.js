const {userModel} = require('../../models/user.js');
const { validate } = require('email-validator');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    signup: async (req, res) => {
        const {firstName, lastName, email, password, cart} = req.body;
        
        const validationResult = validate(email);
        
        if (!validationResult) {
            return res.status(400).json({errorMessage: 'INVALID_EMAIL'});
        }

        if(!password || password.length < 6) {
            return res.status(400).json({errorMessage: 'INVALID_PASSWORD'});
        }

        try {
            const existingUser = await userModel.findOne({email});
            if (existingUser) {
                return res.status(400).json({errorMessage: 'EMAIL_EXISTS'});
            }
             
            const name = {
                first: firstName,
                last: lastName
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
            const verificationCode = Math.floor((Math.random() * 9000)) + 1000;
            console.log(verificationCode);
            const newUser = new userModel({name, email, password: hashedPassword, verificationCode, cart, userType: 'Customer'});
            await newUser.save();
            sendVerificationCode(verificationCode, email);
            res.status(200).json(newUser);
        } catch(error) {
            res.status(400).json(error);
        }
    },
    verify: async (req, res) => {
        const { userId, verificationCode } = req.body;

        if (verificationCode < 1000 || verificationCode >= 10000) {
            return res.status(400).json({errorMessage: 'INVALID_CODE'});
        }

        try {
            let user = await userModel.findById(userId);
            if (!user) {
                return res.status(400).json({errorMessage: 'USER_DOESNT_EXIST'});
            }
            if (!user.verificationCode || user.emailVerified) {
                return res.status(200).json(user);
            }
            if (user.verificationCode && user.verificationCode == verificationCode) {
                user = await userModel.findByIdAndUpdate(userId, {emailVerified: true,  verificationCode: null}, {new: true});
                const token = createToken(userId, 'customer')
                return res.status(200).json({user, token});
            }
            res.status(400).json({errorMessage: 'INCORRECT_CODE'})
        } catch(error) {
            res.status(400).json(error);
        }
    },
    login: async (req, res) => {
        const {email, password} = req.body;

        const validationResult = await validate(email);
        if (!validationResult) {
            return res.status(400).json({errorMessage: 'INVALID_EMAIL'});
        }

        try {
            let user = await userModel.findOne({email});
            if (!user) {
                return res.status(400).json({errorMessage: 'INCORRECT_EMAIL'});
            }
            if (user.registeredWithGoogle) {
                return res.status(400).json({errorMessage: 'GOOGLE_REGISTER'});
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(400).json({errorMessage: 'INCORRECT_PASSWORD'});
            }
            if(!user.emailVerified) {
                const verificationCode = Math.floor((Math.random() * 9000)) + 1000;
                user = await userModel.findByIdAndUpdate(user._id, {verificationCode}, {new: true});
                sendVerificationCode(verificationCode, email);
                return res.status(200).json({user});
            }
            const token = createToken(user._id, 'customer')
            res.status(200).json({user, token});
        } catch(error) {
            res.status(400).json(error);
        }
    },
    resendCode: async (req, res) => {
        const userId = req.params.userId;

        try {
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(400).json({errorMessage: 'USER_DOESNT_EXIST'});
            }
            if (user.emailVerified) {
                return res.status(400).json({errorMessage: 'EMAIL_VERIFIED'});
            }
            const verificationCode = Math.floor((Math.random() * 9000)) + 1000;
            user = await userModel.findByIdAndUpdate(user._id, {verificationCode}, {new: true});
            sendVerificationCode(verificationCode, user.email);
            res.status(200).json({message: 'CODE_SENT'});
        } catch (error) {
            res.status(400).json(error);
        }
    },
    forgotPassword: async (req, res) => {
        const { email } = req.body;

        try {
            const existingUser = await userModel.findOne({email});
            if (!existingUser) {
                return res.status(400).json({errorMessage: 'INCORRECT_EMAIL'});
            }
            if (existingUser.registeredWithGoogle) {
                return res.status(400).json({errorMessage: 'GOOGLE_REGISTER'});
            }
            const verificationCode = Math.floor((Math.random() * 9000)) + 1000;
            user = await userModel.findByIdAndUpdate(user._id, {verificationCode}, {new: true});
            sendVerificationCode(verificationCode, email);
            res.status(200).json({message: 'CODE_SENT'});
        } catch (error) {
            res.status(400).json(error);
        }
    },
    changePassword: async (req, res) => {
        const userId = req.params.id;
        const { password } = req.body;
        
        if(!password || password.length < 6) {
            return res.status(400).json({errorMessage: 'INVALID_PASSWORD'});
        }

        try {
            const hashedPassword = bcrypt.hashSync(password, 10);
            user = await userModel.findByIdAndUpdate(userId, {password: hashedPassword}, {new: true});
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json(error);
        }
    }
};

function sendVerificationCode(code, email) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.PASSWORD
        }
    });

    const source = fs.readFileSync('src/templates/email_template.html', 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacments = {
        code
    }
    const htmlToSend = template(replacments);

    const mailConfigurations = {
        from: 'mohamedahmed1902@gmail.com',
        to: email,
        subject: 'Email Verification',
        // text: `Hi! There, You have recently visited 
        //        our website and entered your email.
        //        Here is your verification code ${code}`,
        html: htmlToSend       
    };

    transporter.sendMail(mailConfigurations, function(error, info){
        if (error) throw Error(error);
        console.log('Email Sent Successfully');
        console.log(info);
    });
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