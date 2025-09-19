import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  profilePic: string;
  accessToken: string;
  refreshToken: string;
}

const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true },
  email: { type: String, required: true },
  name: String,
  profilePic: String,
  accessToken: String,
  refreshToken: String,
});

export default mongoose.model<IUser>("User", UserSchema);
