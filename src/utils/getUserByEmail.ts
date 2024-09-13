import User from "../models/User.model";

const getUserData = async (email: string) => {
  if (!email?.trim()) {
    return null;
  }
  const isExist = await User.findOne({ email });
  return isExist ? isExist : null;
};

export default getUserData;
