import bcrypt from "bcrypt";

const verifyPassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export default verifyPassword;
