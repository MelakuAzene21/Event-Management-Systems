const mongoose = require("mongoose");
const Review = require("../models/Review");
const Event = require("../models/Event");
// Create a review
exports.createReview = async (req, res) => {
    try {
        const { eventId, attendeeId, rating, comment } = req.body;
        const review = new Review({ eventId, attendeeId, rating, comment });
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all reviews for a specific event
exports.getReviewsByEvent = async (req, res) => {
    try {
        const reviews = await Review.find({ eventId: req.params.eventId }).populate("attendeeId", "name");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllReviewEvent= async (req, res) => {
    try {
        const reviews = await Review.find({ eventId: req.params.eventId })
            .populate("attendeeId", "name avatar");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Error fetching reviews" });
    }
};


// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.reviewId,
            { rating, comment },
            { new: true }
        );
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.reviewId);
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getRatingTrends = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ error: "Invalid eventId format" });
        }

        const reviews = await Review.aggregate([
            {
                $match: {
                    eventId: new mongoose.Types.ObjectId(eventId), // Use 'new'
                    rating: { $exists: true, $ne: null },
                    createdAt: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    avgRating: { $avg: "$rating" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        if (reviews.length === 0) {
            return res.json({ labels: [], data: [], message: "No reviews found" });
        }

        const labels = reviews.map(r => r._id);
        const data = reviews.map(r => parseFloat(r.avgRating.toFixed(1)));

        res.json({ labels, data });
    } catch (error) {
        console.error("Error in getRatingTrends:", error);
        res.status(500).json({ error: "Error fetching rating trends", details: error.message });
    }
};

exports.getRatingDistribution = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ error: "Invalid eventId format" });
        }

        const reviews = await Review.aggregate([
            {
                $match: {
                    eventId: new mongoose.Types.ObjectId(eventId), // Use 'new'
                    rating: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const labels = ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"];
        const data = [0, 0, 0, 0, 0];
        reviews.forEach(r => {
            if (r._id >= 1 && r._id <= 5) {
                data[r._id - 1] = r.count;
            }
        });

        res.json({ labels, data });
    } catch (error) {
        console.error("Error in getRatingDistribution:", error);
        res.status(500).json({ error: "Error fetching rating distribution", details: error.message });
    }
};