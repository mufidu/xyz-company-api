const { StatusCodes } = require("http-status-codes");
const {
  getAllEvents,
  getEventById,
} = require("../../../service/sequelize/customer/event");

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

module.exports = {
  getEvents,
  getEvent,
};
