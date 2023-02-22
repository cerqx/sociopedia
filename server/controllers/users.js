import User from "../models/User.js";

//READ
export async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

export async function getUserFriends(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const friends = await Promise.all(user.friends.map((friendId) => User.findById(friendId)));

    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

//UPDATE
export async function addRemoveFriend(req, res) {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    if (!friend) {
      return res.status(404).json({ msg: "User not found." });
    }

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(user.friends.map((friend_id) => User.findById(friend_id)));

    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

//DELETE
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
