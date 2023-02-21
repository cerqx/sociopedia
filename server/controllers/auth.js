import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js ";

//REGISTER USER

export async function register(req, res) {
  try {
    const picturePath = req.file?.filename;
    const { firstName, lastName, email, password, friends, location, occupation } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    res.status(200).json({ msg: "User deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ msg: "Not user registered yet!" });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
