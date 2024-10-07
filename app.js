const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const errorHandlerMiddleware = require("./app/middlewares/handle-error");
const notFoundMiddleware = require("./app/middlewares/not-found");
const promMiddleware = require("express-prometheus-middleware");

const app = express();

app.use(logger("dev"));
app.use(
    promMiddleware({
        metricsPath: "/metrics",
        collectDefaultMetrics: true,
        requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        msg: "Welcome to XYZ Company API",
        data: {},
    });
});

const customerRoutes = {
    auth: require("./app/api/customer/auth/router"),
    order: require("./app/api/customer/order/router"),
    event: require("./app/api/customer/event/router"),
};

const adminRoutes = {
    auth: require("./app/api/admin/auth/router"),
    event: require("./app/api/admin/event/router"),
};

Object.values(customerRoutes).forEach((route) => app.use("/api", route));
Object.values(adminRoutes).forEach((route) => app.use("/api", route));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
