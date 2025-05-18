const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        description: {
            type: String,
            trim: true
        },
        icon: {
            url: {
                type: String,
                trim: true
            },
            public_id: {
                type: String,
                trim: true
            }
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);