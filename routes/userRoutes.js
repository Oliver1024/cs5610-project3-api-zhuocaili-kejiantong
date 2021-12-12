const UserModel = require("../models/user.model.js");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JobModel = require("../models/job.model.js");
const auth_middleware = require("../middleware/auth.js");
const bcrypt = require("bcrypt");
let re =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// const SECRET = 'onBoardSpecficAucenticationToken'
const expiresIn = "1h";

const createToken = (payload) => {
  return jwt.sign(payload, process.env.ON_BOARD_SRCRET, {
    expiresIn: expiresIn,
  });
};

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !password || !username)
    return res.status(404).send({ message: "Enter infomation!" });
  if (!email.match(re))
    return res.status(400).send({ message: "Invaild email format" });
  const existedEmail = await UserModel.getUserByEmail(email);
  const existedUsername = await UserModel.getUserByUsername(username);
  if (existedEmail) {
    return res.status(422).send({ message: "Email already exists" });
  } else if (existedUsername) {
    return res.status(424).send({ message: "Username already exists" });
  } else {
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      try {
        UserModel.addUser({
          email: email,
          username: username,
          password: hash,
        })
          .then((user) => {
            const token = createToken({ email, username });
            return res
              .cookie("onBoardToken", token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
              })
              .status(200)
              .send({ email, username });
          })
          .catch((error) =>
            res.status(500).send({ message: "Internal database error" })
          );
      } catch (error) {
        res.status(422).send({ message: "Internal database error" });
      }
    });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(404).send({ message: "Enter infomation!" });
  if (!email.match(re))
    return res.status(400).send({ message: "Invaild email format" });
  const existedUser = await UserModel.getUserByEmail(email);

  if (existedUser) {
    bcrypt.compare(password, existedUser.password, function (err, result) {
      try {
        if (result === true) {
          const username = existedUser.username;
          const token = createToken({ email, username });
          return res
            .cookie("onBoardToken", token, {
              httpOnly: true,
              sameSite: "none",
              secure: true,
            })
            .status(200)
            .send({ email, username });
        } else {
          return res.status(404).send({ message: "Invalid password!" });
        }
      } catch (error) {
        return res.status(404).send({ message: "Invalid password!" });
      }
    });
  } else {
    return res.status(404).send({ message: "This email does not exist." });
  }
});

router.get("/currentUser", auth_middleware, async (req, res) => {
  const existedUser = await UserModel.getUserByEmail(req.email);
  let user = {
    username: req.username,
    email: req.email,
    image: existedUser.image,
  };
  console.log(user);
  return res.status(200).send(user);
});

router.get("/profile", auth_middleware, function (req, res) {
  UserModel.getUserByEmail(req.email)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

router.put("/profile", auth_middleware, (req, res) => {
  if (req.body.image === "")
    return res.status(400).send({ message: "Please upload new image" });
  UserModel.findUserAndUpdate(req.email, req.body)
    .then((response) => {
      console.log(req.body);
      res
        .status(200)
        .json({ user: response.data, message: "Successfully Updated" });
    })
    .catch((err) => {
      res.status(422).send(err.message);
    });
});

router.get("/logout", auth_middleware, function (req, res) {
  return res
    .clearCookie("onBoardToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send({ message: "Logout successfully!" });
});

router.get("/favorites", auth_middleware, (req, res) => {
  UserModel.getUserByEmail(req.email)
    .then(async (user) => {
      let posts = [];
      for (favorite of user.favorites) {
        await JobModel.getJobById(favorite._id)
          .then((job) => {
            posts.push({ job: job, status: favorite.status });
          })
          .catch((err) => {
            res.status(500).send(err.message);
          });
      }
      res.status(200).send(posts);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

router.post("/favorites/add", auth_middleware, (req, res) => {
  JobModel.getJobById(req.body.id)
    .then((job) => {
      UserModel.getUserByEmail(req.email)
        .then((user) => {
          user.favorites.push({ _id: job, status: req.body.status });
          user.save();
          res.status(200).send({ message: "Added successfully!" });
        })
        .catch((err) => {
          res.status(404).send(err.message);
        });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

router.post("/favorites/remove", auth_middleware, (req, res) => {
  JobModel.getJobById(req.body.id)
    .then((job) => {
      UserModel.getUserByEmail(req.email)
        .then((user) => {
          user.favorites.pull(job);
          user.save();
          res.status(200).send({ message: "Removed successfully!" });
        })
        .catch((err) => {
          res.status(404).send(err.message);
        });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

router.put(`/favorites/:id`, auth_middleware, (req, res) => {
  UserModel.getUserByEmail(req.email)
    .then((user) => {
      const a = user.favorites.findIndex(
        (favorite) => favorite._id.valueOf() === req.params.id
      );
      user.favorites[a].status = req.body.status;
      console.log(req.body);
      console.log(user.favorites[a]);
      user.save();
      res.status(200).send({ status: req.body.status, message: "Success" });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

module.exports = router;
