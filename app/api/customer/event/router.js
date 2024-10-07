const express = require("express");
const { getEvents, getEvent } = require("./controller");
const { authenticateCustomerToken } = require("../../../middlewares/auth");
const router = express();

router.get("/customer/event/:id", authenticateCustomerToken, getEvent);
router.get("/customer/event", authenticateCustomerToken, getEvents);

module.exports = router;
