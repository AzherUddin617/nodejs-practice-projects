const path = require('path');
// const https = require('https');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

require('dotenv').config();

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY_01: process.env.COOKIE_KEY_01,
    COOKIE_KEY_02: process.env.COOKIE_KEY_02,
};

const authOptions = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refressToken, profile, done) {
    console.log("Google profile", profile);
    done(null, profile);
}

passport.use(new Strategy(authOptions, verifyCallback));

// Save the session to the cookie
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Read the session from the cookie
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

const app = express();

app.use(helmet());

app.use(cookieSession({
    name: "session",
    maxAge: 1000 * 60 * 60 * 24,
    keys: [ config.COOKIE_KEY_01, config.COOKIE_KEY_02 ],
}));
app.use(passport.initialize());
app.use(passport.session());

const PORT = 3000;


function checkLoggedIn(req, res, next) { // req.user
    console.log("Current user:", req.user);
    const isLoggedIn = req.isAuthenticated() && req.user;
    if (!isLoggedIn) {
        return res.status(401).json({
            error: "You must log in!"
        });
    }
    next();
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['email'],
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
    session: true
}), (res, req) => {
    console.log("Google called us back!");
});

app.get('/auth/logout', (req, res) => {
    req.logout();
    return res.redirect('/');
});

app.get('/secret', checkLoggedIn, (req, res) => {
    res.send("Secret code 37");
});

app.get('/failure', (req, res) => {
    res.send("Failed to login");
});

// https.createServer(app).listen(PORT, ()=> console.log(`Listening to port: ${PORT}`));
app.listen(PORT, ()=> console.log(`Listening to port: ${PORT}`));