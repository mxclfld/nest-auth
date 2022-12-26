import * as bcrypt from 'bcryptjs';

export default function encodePassword(password: string) {
  return bcrypt.hashSync(password, 8);
}
