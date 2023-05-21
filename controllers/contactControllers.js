const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/customError");
const Contact = require("../models/Contact");

const getAllContacts = async (req, res) => {
  const { name, search } = req.query;
  const { userId } = req.user;
  const queryObj = { user: userId };

  if(name) queryObj.name = {$regex: name, $options: "i"}
  const contacts = await Contact.find(queryObj);
  res
    .status(StatusCodes.OK)
    .json({ message: "Success", contacts, count: contacts.length });
};

const createContact = async (req, res) => {
  const { userId: user } = req.user;
  const name = req.body.lastname
    ? `${firstname} ${lastname}`
    : req.body.firstname;
  const contact = await Contact.create({ ...req.body, name, user });
  res.status(StatusCodes.CREATED).json({ message: "Success", contact });
};

const getSingleContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOne({ _id: id, user: req.user.userId });
  if (!contact) throw new CustomError.NotFoundError("Contact not found.");
  res.status(StatusCodes.OK).json({ message: "Success", contact });
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOneAndUpdate(
    { _id: id, user: req.user.userId },
    req.body,
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
};
