const axios = require('axios');
const {userModel} = require('../../models/user.js');
const { validate } = require('email-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

module.exports = {
  googleRegister: (req, res) => {
    res.header('Access-Control-Allow-Origin','http://localhost:3000');
    res.header('Access-Control-Allow-Origin','http://localhost:4200');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
    )

    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
      prompt: 'consent',
      response_type: 'code',
    });

    //res.redirect(authorizeUrl);
    res.json({url: authorizeUrl});
  },
  googleCallback: async (req, res) => {
    const { code } = req.query;

    try {
      const oAuth2Client = new OAuth2Client(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
      )

      const tokenResponse = await oAuth2Client.getToken(code);
      await oAuth2Client.setCredentials(tokenResponse.tokens);
      console.log('Tokens acquired');
      const credentials = oAuth2Client.credentials;
      const userData = await getUserData(credentials.access_token);

      const existingUser = await userModel.findOne({email: userData.email});
      

      if(existingUser) {
        const token = createToken(existingUser._id);
        return res.redirect(`${process.env.CLIENT_URI}?token=${token}`);
        //return res.status(200).json({user: existingUser, token});
      }

      const newUser = new userModel({name:
        {
          first: userData.given_name,
          last: userData.family_name
        },
        email: userData.email,
        emailVerified: true,
        registeredWithGoogle: true
      });
      
      await newUser.save();
      const token = createToken(newUser._id);

      res.redirect(`${process.env.CLIENT_URI}?token=${token}`);
      //res.status(200).json({user: newUser, token});
    } catch(error) {
      res.status(400).json(error);
      console.log(error)
    }
  }
}

async function getUserData(access_token){
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  const data = await response.json();
  console.log('data', data);
  return data;
}

function createToken(userId) {
  const token = jwt.sign({
      userId
  }, process.env.JWT_SECRET,
  {
      expiresIn: 1 * 60 * 60
  });

  return token;
}
