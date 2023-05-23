const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/customError");
const Contact = require("../models/Contact");
const mongoose = require("mongoose");
const utilFuncs = require("../utils/index");

const getAllContacts = async (req, res) => {
  const { name, nationality, sort, code } = req.query;
  const { userId } = req.user;
  const queryObj = { user: userId };
  // Query by name
  if (name) {
    queryObj.name = { $regex: name, $options: "i" };
  }
  // Query by nationality
  if (nationality) {
    queryObj.nationality = nationality;
  }

  let result = Contact.find(queryObj);
  // Sort
  if (sort) {
    let sorted = sort.split(",").join(" ");
    result = result.sort(sorted);
  } else {
    result = result.sort("name");
  }
  // Pagination
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 20;
  const skip = (page - 1) * perPage;

  result = result.skip(skip).limit(perPage);
  const contacts = await result;
  // Using aggregate pipelines
  let stats = await Contact.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: "$relationship",
        count: { $sum: 1 },
      },
    },
  ]);
  // Reducing the aggregate to a single object
  stats = stats.reduce((acc, cur) => {
    const { _id, count } = cur;
    acc[_id] = count;
    return acc;
  }, {});

  const birthdays = await utilFuncs.checkBirthdays(contacts);

  res.status(StatusCodes.OK).json({
    message: "Success",
    contacts,
    count: contacts.length,
    stats,
    birthdays,
  });
};

const stopWords = ["the", "and", "a", "an", "in", "is", "it"];

const searchContacts = async (req, res) => {
  console.log(req.params);
  const { search } = req.params;
  const { userId } = req.user;

  let searchQuery = search
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .trim()
    .split(" ")
    .filter((n) => !stopWords.includes(n))
    .filter(Boolean);

  // // Using Promise.all()
  // const allContacts = searchQuery.map((n) => {
  //   return Contact.find({ tags: n, user: userId });
  // });
  // const contacts = await (await Promise.all(allContacts)).filter(Boolean);
  // Using mongoDB query operators
  const contacts = await Contact.find({ tags: { $in: searchQuery } }).sort(
    "name"
  );
  res
    .status(StatusCodes.OK)
    .json({ message: "Success", contacts, count: contacts.length });
};

const createContact = async (req, res) => {
  const { userId: user } = req.user;
  // Getting tags for each contact. This filters for symbols and stopwords
  const tags = req.body.description
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .trim()
    .split(" ")
    .filter((n) => !stopWords.includes(n))
    .filter(Boolean);
  // Getting the name property
  const name = req.body.lastname
    ? `${firstname} ${lastname}`
    : req.body.firstname;
  // Creating contact
  const contact = await Contact.create({ ...req.body, name, user, tags });
  res.status(StatusCodes.CREATED).json({ message: "Success", contact });
};

const getSingleContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOne({ _id: id, user: req.user.userId });
  if (!contact) throw new CustomError.NotFoundError("Contact not found.");
  console.log(contact._id);
  res.status(StatusCodes.OK).json({ message: "Success", contact });
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  // let contact = await Contact.findOne({ _id: id, user: req.user.userId });
  const queryObj = { ...req.body };
  if(req.body.description) {
    queryObj.tags = req.body.description
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .trim()
      .split(" ")
      .filter((n) => !stopWords.includes(n))
      .filter(Boolean);
  }
  const contact = await Contact.findOneAndUpdate(
    { _id: id, user: req.user.userId },
    queryObj,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ message: "Success", contact });
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOneAndDelete({
    _id: id,
    user: req.user.userId,
  });
  if (!contact) throw new CustomError.NotFoundError("Contact not found.");
  res.status(StatusCodes.OK).json({ message: "Successfully deleted contact" });
};

module.exports = {
  getAllContacts,
  getSingleContact,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
};
