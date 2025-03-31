const express = require("express");
const Razorpay = require("razorpay");
const Bid = require("../models/Bid"); // Import Bid model
const router = express.Router();

const razorpay = new Razorpay({
    key_id: "rzp_test_HYnZ9zuIDYdtK8",
    key_secret: "aj0FGGtWkN31nnMd1TCa6ga4"
});

/**
 * @route   POST /api/razorpay/order
 * @desc    Create a Razorpay order
 */
router.post('/order', async (req, res) => {
    const { bidId, amount } = req.body;

    const options = {
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `receipt_${bidId}`,
        payment_capture: 1
    };

    try {
        const order = await razorpay.orders.create(options);

        // ✅ Store razorpay_order_id in the bid record
        const updatedBid = await Bid.findByIdAndUpdate(
            bidId, 
            { razorpay_order_id: order.id }, 
            { new: true }
        );

        if (!updatedBid) {
            return res.status(404).json({ success: false, message: "Bid not found" });
        }

        res.json({
            order_id: order.id,
            currency: order.currency,
            amount: order.amount,
            success: true
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Some error occurred" });
    }
});

/**
 * @route   GET /api/razorpay/payment/:paymentId
 * @desc    Fetch a payment status
 */
router.get('/payment/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await razorpay.payments.fetch(paymentId);
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        res.json({
            amount: payment.amount / 100, // Convert back to normal amount
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            created_at: new Date(payment.created_at * 1000).toLocaleString()
        });
    } catch (error) {
        console.error("Error fetching payment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @route   POST /api/razorpay/payment/verify
 * @desc    Verify a Razorpay payment
 */
router.post('/payment/verify', async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    try {
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        if (!payment || payment.status !== "captured") {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        // ✅ Update the bid status to "Paid" in the database
        await Bid.findOneAndUpdate(
            { razorpay_order_id },
            { bidState: "Paid", razorpay_payment_id },
            { new: true }
        );

        res.json({ success: true, message: "Payment verified and bid updated" });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Error verifying payment" });
    }
});

module.exports = router;
