const router = require("express").Router();
const JobModel = require("../models/job.model.js");
const auth_middleware = require("../middleware/auth.js");

router.post("/", auth_middleware,  async (req, res) => {
  const { title, salary, companyName, location, jobDescription, image } =
    req.body;
    if (!title || !salary || !companyName || !location || !jobDescription) {
      return res
        .status(422)
        .send({ message: "Please enter all required fields" });
    }
    JobModel.addJob({
      ...req.body,
      posterEmail: req.email,
    })
      .then((jobResponse) => {
        res.status(200).send(jobResponse);
      })
      .catch((error) => {
        res.status(404).send({ message: "Problem found when posting job" });
      });
});

router.get("/posts", auth_middleware, (req, res) => {
  JobModel.getJobsByPosterEmail(req.email)
    .then((posts) => {
      res.status(200).send(posts);
    })
    .catch((err) => {
      res.status(404).send({ message: "Bad command" });
    });
});

router.get("/job/:jobId", (req, res) => {
  const jobId = req.params.jobId;
  JobModel.getJobById(jobId)
    .then((job) => {
      res.status(200).send(job);
    })
    .catch((err) => {
      res.status(400).send({ message: "Something went wrong" });
    });
});

router.put("/job/:jobId", auth_middleware, (req, res) => {
  const { title, salary, companyName, location, jobDescription } = req.body;
  if (!title || !salary || !companyName || !location || !jobDescription) {
    return res
      .status(422)
      .send({ message: "Please enter all required fields" });
  }
  JobModel.findJobAndUpdate(req.params.jobId, req.body)
    .then((response) => {
      res.status(200).send({ message: "Successfully Updated" });
    })
    .catch((err) => {
      res.status(422).send({ message: "OnBoard internal issues are found" });
    });
});

router.get("/favorites", auth_middleware, (req, res) => {
  JobModel.getFavoritesByUserEmail(req.email)
    .then((posts) => {
      res.status(200).send(posts);
    })
    .catch((err) => {
      res.status(404).send({ message: "Bad command" });
    });
});

router.get("/search", (req, res) => {
  res.status(200).send([]);
});

router.get("/search/:title", (req, res) => {
  const title = req.params.title;
  const foundJob = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  JobModel.getSearchedJobs(foundJob)
    .then((jobs) => {
      res.status(200).send(jobs);
    })
    .catch((err) => {
      res.status(400).send([]);
    });
});

router.delete("/job/:jobId", auth_middleware, (req, res) => {
  JobModel.findJobAndDelete(req.params.jobId)
    .then((response) => {
      res.status(200).send({ message: "Successfully Deleted" });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
