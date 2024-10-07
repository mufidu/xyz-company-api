const { StatusCodes } = require("http-status-codes");
const {
  getAllEvents,
  getEventById,
  addNewEvent,
  updateEventById,
  deleteEventById,
} = require("../../../service/sequelize/admin/event");

const getEvents = async (req, res, next) => {
  try {
    const result = await getAllEvents(req);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const result = await getEventById(req);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const addEvent = async (req, res, next) => {
  try {
    const result = await addNewEvent(req);

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const result = await updateEventById(req);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const result = await deleteEventById(req);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      msg: "OK",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEvents,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent,
};
