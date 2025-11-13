const prisma = require("../db/config");
const bcrypt = require("bcrypt");
const {setUser} = require("../utils/auth");

const access = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = setUser(user);

    res.cookie("token", token, { maxAge: 60 * 1000 });

    res.status(200).json({ message: "Login successful", user: user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  access,
};
