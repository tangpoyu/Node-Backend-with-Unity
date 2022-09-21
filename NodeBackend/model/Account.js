module.exports = function (mongoose) {

    const { Schema } = mongoose;
    const accountSchema = new Schema({
        permission: Number,
        username: String,
        password: String,
        lastAuthentication: Date,
        active: Boolean
    });

    mongoose.model('accounts', accountSchema);
}

