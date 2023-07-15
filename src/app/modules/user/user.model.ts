/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { userRoleFields } from '../../../constants/user';
import config from '../../../config';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: userRoleFields,
      default: 'user',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  const user = this;
  // hash the password before save data to collection
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

userSchema.statics.isUserExit = async function (
  email: string
): Promise<Pick<IUser, '_id' | 'password' | 'role' | 'name' | 'email'> | null> {
  return await User.findOne({ email: email }, { password: 1, role: 1 });
};

userSchema.statics.isPasswordMatched = async function (
  savedPassword: string,
  givenPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

const User = model<IUser, UserModel>('User', userSchema);

export default User;
