const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const crypto = require("crypto")

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
    },
    password: {
        type: String,
        maxlength: [100, 'Password must be less than 100 characters'],
        required: true
    },
    role: {
        type: String,
        required: true
    },
    skills: {
        type: Array,
        required: true
    },
    
    created_at: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
})

UserSchema.pre("save", function (next) {
	const user = this;

	if (this.isModified("password") || this.isNew) {
		bcrypt.genSalt(10, function (saltError, salt) {
			if (saltError) {
				return next(saltError);
			} else {
				bcrypt.hash(user.password, salt, function (hashError, hash) {
					if (hashError) {
						return next(hashError);
					}

					user.password = hash;
					// Delete passwordConfirm field
                    this.passwordConfirm = undefined;
                    this.created_at = Date.now()
                    next();
				});
			}
		});
	} else {
		return next();
	}
});


UserSchema.methods.authenticate = async function (candidatePassword, callback) {
	if (!callback) return bcrypt.compare(candidatePassword, this.password);

	bcrypt.compare(candidatePassword, this.password, function (err, matching) {
		if (err) return callback(err);
		return callback(null, matching);
	});
};

/* 
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    this.created_at = Date.now()
    next();
});
*/

/**
 * Reset Password
 */
UserSchema.methods.createPasswordResetToken = function () {
    let resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = resetToken;
    resetToken = resetToken + "|" + this._id;
    this.created_at = Date.now()
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    let bufferObj = Buffer.from(resetToken, "utf8");
    resetToken = bufferObj.toString("base64");
    return resetToken;
}

/* --------- Local database connection ---------- */
//For single connections we export models
//const user = mongoose.model('User', UserSchema);
//module.exports = user;
/* --------- Local database connection ---------- */

/* --------- Live cloud server database connection ---------- */
//For multiple connections we export schemas not models
module.exports = UserSchema;
/* --------- Live cloud server database connection ---------- */
