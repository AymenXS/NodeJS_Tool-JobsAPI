const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort('createdAt');
  res.status(StatusCodes.OK).send({ count: jobs.length, jobs });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).send(job);
};

const getJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const job = await Job.findOne({
    _id: jobID,
    createdBy: userID,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).send(job);
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userID },
    params: { id: jobID },
  } = req;

  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty');
  }

  const job = await Job.findByIdAndUpdate({ _id: jobID, createdBy: userID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobID}`);
  }

  res.status(StatusCodes.OK).send(job);
};

const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobID, createdBy: userID });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobID}`);
  }

  res.status(StatusCodes.OK).send(job);
};

module.exports = { createJob, deleteJob, getAllJobs, getJob, updateJob };
