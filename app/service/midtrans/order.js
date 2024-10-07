const { BadRequestError, NotFoundError } = require("../../errors");
const Transaction = require("../../../models").Transaction;
const Event = require("../../../models").Event;
const Ticket = require("../../../models").Ticket;

const midtransClient = require("midtrans-client");
const config = require("../../../config/environment-config");
config.loadEnvironmentVariables();

const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SANDBOX_SERVER_KEY,
    clientKey: process.env.MIDTRANS_SANDBOX_CLIENT_KEY,
});

const checkout = async (req) => {
    const { id, fullName, email } = req.user.customer;
    const { eventId, quantity } = req.body;

    const event = await Event.findByPk(eventId);
    if (!event) {
        throw new NotFoundError("Event not found");
    }

    const grossAmount = event.price * quantity;

    const serviceFee = (grossAmount * 7) / 100;

    const netAmount = grossAmount + serviceFee;

    const lastTransaction = await Transaction.findOne({
        order: [["id", "DESC"]],
    });
    let invoiceNumber = "TICKETS-ORDER-0001";
    if (lastTransaction) {
        const lastInvoiceNumber = lastTransaction.invoiceNumber;
        const lastInvoiceNumberArray = lastInvoiceNumber.split("-");
        const lastInvoiceNumberInt = parseInt(lastInvoiceNumberArray[2]);
        invoiceNumber = `TICKETS-ORDER-${(
            "0000" +
            (lastInvoiceNumberInt + 1)
        ).slice(-4)}`;
    }

    const transaction = await Transaction.create({
        CustomerId: id,
        invoiceNumber,
        amount: netAmount,
        status: "Pending",
        // items: JSON.stringify([{ eventId, quantity }]),
        // Save event id, quantity, and user id
        items: JSON.stringify([{ eventId, quantity, userId: id }]),
    });

    if (!transaction) {
        throw new BadRequestError("Failed to create transaction in database");
    }

    const midtrans = await core.charge({
        payment_type: "qris",
        transaction_details: {
            gross_amount: netAmount,
            order_id: transaction.invoiceNumber,
        },
        customer_details: {
            full_name: fullName,
            email: email,
        },
    });

    if (midtrans.status_code !== "201") {
        transaction.status = "failure";
        await transaction.save();
        throw new BadRequestError("Failed to create transaction in midtrans");
    } else {
        transaction.qrisString = midtrans.qr_string;
        transaction.expiryTime = midtrans.expiry_time;
        transaction.invoiceDate = midtrans.transaction_time;
        transaction.qrisURL = midtrans.actions[0].url;
        await transaction.save();
    }

    return transaction;
};

const paymentHandler = async (req) => {
    const { order_id, transaction_status } = req.body;

    const transaction = await Transaction.findOne({
        where: {
            invoiceNumber: order_id,
        },
    });

    if (!transaction) {
        throw new NotFoundError("Transaction not found");
    }

    if (transaction.status !== "Pending") {
        throw new BadRequestError("Transaction already paid or expired");
    }

    if (transaction_status === "settlement") {
        transaction.status = "Paid";
        // Create ticket
        const items = JSON.parse(transaction.items);
        for (const item of items) {
            const { eventId, quantity, userId } = item;
            for (let i = 0; i < quantity; i++) {
                await Ticket.create({
                    EventId: eventId,
                    CustomerId: userId,
                });
            }
        }
    } else if (
        transaction_status === "cancel" ||
        transaction_status === "expire"
    ) {
        transaction.status = "Expired";
    } else if (transaction_status === "deny") {
        // Ignore deny status
    } else if (transaction_status === "pending") {
        transaction.status = "Pending";
    }

    await transaction.save();

    return transaction;
};

module.exports = {
    checkout,
    paymentHandler,
};
