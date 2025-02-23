const express = require("express");
const {
    createReview,
    getReviewsByEvent,
    updateReview,
    deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/", createReview);
router.get("/:eventId", getReviewsByEvent);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

module.exports = router;
