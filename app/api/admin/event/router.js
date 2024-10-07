const express = require("express");
const {
  getEvents,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent,
} = require("./controller");
const { authenticateAdminToken } = require("../../../middlewares/auth");
const router = express();

router.get("/admin/event/:id", authenticateAdminToken, getEvent);
router.put("/admin/event/:id", authenticateAdminToken, updateEvent);
router.delete("/admin/event/:id", authenticateAdminToken, deleteEvent);
router.get("/admin/event", authenticateAdminToken, getEvents);
router.post("/admin/event", authenticateAdminToken, addEvent);

module.exports = router;
