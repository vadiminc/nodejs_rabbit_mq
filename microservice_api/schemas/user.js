import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    email : {
        type: String,
        required: true
    }
}, {
    strict: false
});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email', usernameUnique: false});

export default mongoose.model('user', UserSchema);