const express = require("express");
const {
    createReview,
    getReviewsByEvent,
    updateReview,
    deleteReview,
    getAllReviewEvent,
    getRatingTrends,
    getRatingDistribution,
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/", createReview);
router.get("/:eventId", getReviewsByEvent);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);
router.get("/:eventId", getAllReviewEvent);
router.get("/trends/:eventId", getRatingTrends);
router.get("/distribution/:eventId", getRatingDistribution);
module.exports = router;
