const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    profileImage: {
        type: String,
        default: "not uploaded"
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        require: true,
        // unique: true
    },
    password: {
        type: String,
        require: true
    },
    mobileNumber: {
        type: String,
        require: true
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    profileImage: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    googleid: {
        type: String,
        required: false
    },
    address: [{
        firstName: {
            type: String,
            required: true
        },
        secondName: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: String,
            required: true
        },
        alternativeMobile: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true,
            unique: true
        },
        pincode: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },


    }],
    deliveryAddress: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async (password) => {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("user", userSchema);
module.exports = User;