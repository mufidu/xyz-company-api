const { BadRequestError, NotFoundError } = require("../../../errors");
const { sequelize } = require("../../../../models");
const Event = require("../../../../models").Event;
const config = require("../../../../config/environment-config");
config.loadEnvironmentVariables();

const getAllEvents = async (req) => {
  const { name, location, date } = req.body;

  const where = {};
  if (name) {
    where.name = name;
  }
  if (location) {
    where.location = location;
  }
  if (date) {
    where.date = date;
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

const addNewEvent = async (req) => {
  const { name, date, location, quantity } = req.body;

  if (!name || !date || !location || !quantity) {
    throw new BadRequestError("All fields are required");
  }

  const result = await sequelize.transaction(async (t) => {
    const sequelizeEvent = await Event.create(
      {
        name,
        date,
        location,
        quantity,
      },
      {
        transaction: t,
      }
    );
    return sequelizeEvent;
  });
  return result;
};

const updateEventById = async (req) => {
  const { id } = req.params;
  const { name, date, location, quantity } = req.body;

  const event = await Event.findByPk(id);
  if (!event) {
    throw new NotFoundError("Event not found");
  }

  const result = await sequelize.transaction(async (t) => {
    const updatedEvent = await Event.update(
      {
        name,
        date,
        location,
        quantity,
      },
      {
        where: { id },
        returning: true,
        plain: true,
        transaction: t,
      }
    );
    return updatedEvent[1].dataValues;
  });

  return result;
};

const deleteEventById = async (req) => {
  const { id } = req.params;

  const event = await Event.findByPk(id);
  if (!event) {
    throw new NotFoundError("Event not found");
  }

  await Event.destroy({ where: { id } });
  return { message: "Event deleted successfully" };
};

module.exports = {
  getAllEvents,
  getEventById,
  addNewEvent,
  updateEventById,
  deleteEventById,
};
