const mongoose = require('mongoose');
const Event = require('../models/Event');
const Category = require('../models/Category');

async function updateEvents() {
    try {
        // Connect to your MongoDB database
        await mongoose.connect('mongodb://localhost:27017/event-test');
        console.log('Connected to MongoDB');

        // Get all events
        const events = await Event.find();
        console.log(`Found ${events.length} events`);

        // Update each event's category to reference Category ID
        let updatedCount = 0;
        let skippedCount = 0;
        for (const event of events) {
            if (event.category && typeof event.category === 'string') { // Check if category is a string
                const category = await Category.findOne({ name: event.category.toLowerCase() });
                if (category) {
                    event.category = category._id;
                    await event.save();
                    console.log(`Updated event ${event._id}: category set to ${category._id} (${category.name})`);
                    updatedCount++;
                } else {
                    console.warn(`No category found for event ${event._id} with category ${event.category}`);
                    skippedCount++;
                }
            } else {
                console.log(`Skipped event ${event._id}: category is ${event.category ? 'already an ObjectId' : 'null/undefined'}`);
                skippedCount++;
            }
        }

        console.log(`Event migration completed: ${updatedCount} updated, ${skippedCount} skipped`);
    } catch (error) {
        console.error('Error during event migration:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

updateEvents();