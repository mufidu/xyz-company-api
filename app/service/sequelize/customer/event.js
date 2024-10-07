const { BadRequestError, NotFoundError } = require("../../../errors");
const { sequelize } = require("../../../../models");
const Event = require("../../../../models").Event;
const config = require("../../../../config/environment-config");
config.loadEnvironmentVariables();

const getAllEvents = async (req) => {
  const { genre, author, year } = req.body;

  const where = {};
  if (genre) {
    where.genre = genre;
  }
  if (author) {
    where.author = author;
  }
  if (year) {
    where.year = year;
  }

  const events = await Event.findAll({ where });
  return events;
};

const getEventById = async (req) => {
  const { id } = req.params;

  const event = await Event.findByPk(id);
  if (!event) {
    throw new NotFoundError("Event not found");
  }

  return event;
};

module.exports = {
  getAllEvents,
  getEventById,
};
