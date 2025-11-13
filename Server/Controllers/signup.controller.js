const prisma = require("../db/config");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const createUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: createUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
};
