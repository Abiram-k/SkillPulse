const User = require('../models/userModel');
const nodeMailer = require("nodemailer");
const path = require("path");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.resolve(__dirname, "../.env") })


exports.baseRoute = (req, res) => {
    res.status(200).send("SERVER IS RUNNING...");
}

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    }
});

const sendOTPEmail = async (email, otp, name) => {
    console.log("OTP IS:", otp);
    console.log("EMAIL:", email);
    try {
        const mailCredentials = {
            from: "abiramk0107@gmail.com",
            to: email,
            subject: 'SKILL PULSE ,Your OTP for Signup ',
            text: `Dear ${name},

            Thank you for signing up! 

Your One-Time Password (OTP) for completing your signup process is:

One-Time-Password is: ${otp}

Please enter this OTP on the signup page to verify your account. This OTP is valid for a limited time only, so please use it promptly.

If you did not initiate this request, please ignore this email. Your account security is important to us.

Best regards,  
The [SkillPulse] Team`,
        };
        await transporter.sendMail(mailCredentials);
        console.log('OTP sent successfully');
        return true
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false;
    }
}




exports.signUp = async (req, res) => {
    console.log("hello signup clicked from backend")
    const { firstName, email } = req.body;
    const otpExpiry = 30;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    } else {
        const otp = generateOTP();
        const otpSent = await sendOTPEmail(email, otp, firstName);
        console.log(email)

        if (!otpSent) {
            return res.status(500).json({ message: "Failed to send OTP" });
        }
        req.session.user = req.body;
        req.session.otp = otp;

        //to delte the otp after 30seconds;
        setTimeout(() => {
            if (req.session && req.session.otp) {
                delete req.session.otp;
                console.log('OTP expired');
            }
        }, otpExpiry * 1000);

        console.log(req.session.otp);
        console.log(req.session.user);
        return res.status(200).json({ message: "Proceeded to Otp verification" })
    }
}

exports.otp = async (req, res) => {

    const { otp } = req.body;
    console.log(otp, req.session.otp);
    const newUser = req.session.user;
    console.log("new User", newUser);

    try {
        if (!req.session.otp) {
            return res.status(400).json({ message: "Otp expired !" })
        }
        else if (!req.session.user) {
            return res.status(400).json({ message: "User not found" });
        }
        else if (req.session.otp == otp) {
            const user = await User.create(req.session.user)
            res.status(200).json({ message: "User Created Succesfully", user })
            req.session.otp = null;
        } else {
            return res.status(400).json({ message: "Incorrect Otp !" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}


exports.resendOtp = async (req, res) => {
    try {
        const otp = generateOTP();
        req.session.otp = otp;

        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Failed to store session" });
            }
        });
        if (req.session.user) {
            const email = req.session.user.email
            const otpSent = await sendOTPEmail(email, otp);
            if (!otpSent) {
                return res.status(500).json({ message: "Failed to send OTP" });
            } else {
                return res.status(200).json({ message: "Otp resended !" })
            }
        } else {
            return res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const user = await User.findOne({ email });
        if (user) {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: "Password is incorrect" });
            } else {

                //jwt toke sign
                const token = jwt.sign("usertoken", process.env.JWT_SECERETE, { expiresIn: "12d" })
                res.cookie({
                    name: "usertoken"
                })
                return res.status(200).json({ message: "Successfully Logged in", token });

            }
        }
        else {
            return res.status(400).json({ message: "User not found !" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}


