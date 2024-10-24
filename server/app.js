const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("node:path");
const cors = require("cors");
const userRouter = require('./Routes/userRoutes')
const adminRouter = require('./Routes/adminRoutes')
const nodeMailer = require("nodemailer");
const passport = require("passport");
require('./config/passport');
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRETE = process.env.SESSION_KEY;
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Creating Session
app.use(session({
    secret: SESSION_SECRETE,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 * 24 }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRouter)
app.use("/admin", adminRouter);

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("SuccessFully connected to mongoDB")
}).catch((error) => {
    console.log(`Error occured with mongodb ${error.name}`)
})
app.listen(PORT, () => {
    console.log(`Server Is Running At Port : ${PORT}`);
})