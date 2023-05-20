const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const utilFuncs = require("../utils/index");
const CustomError = require("../errors/customError");
const Contact = require("../models/Contact");

const getAllContacts = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Success" });
};

const createContact = async (req, res) => {
  res.status(StatusCodes.CREATED).json({ message: "Success" });
};

const getSingleContact = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Success" });
};

const updateContact = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Success" });
};

const deleteContact = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Success" });
};

module.exports = {
  getAllContacts,
  getSingleContact,
  createContact,
  updateContact,
  deleteContact,
};
