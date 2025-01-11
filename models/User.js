import bcrypt from 'bcrypt';
import { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    enum: ['credentials'],
    required: true,
    default: 'credentials',
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    required: true,
  },
  image: {
    link: { type: String },
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  orderId: {
    type: [Schema.Types.ObjectId],
    ref: 'Order',
    default: [],
  },
  address: {
    streetAddress: { type: String, default: '' },
    barangay: { type: String, default: '' },
    municipality: { type: String, default: '' },
    province: { type: String, default: '' },
    postalCode: { type: String, default: '' },
  },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.password) return next();
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = models?.User || model('User', UserSchema);
