const mongoose = require('mongoose');
const Event = require('../models/Event');
const Category = require('../models/Category');

async function migrateCategories() {
    try {
        // Connect to your MongoDB database
        await mongoose.connect('mongodb://localhost:27017/event-test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Get unique categories from events
        const uniqueCategories = await Event.distinct('category');
        console.log('Unique categories found:', uniqueCategories);

        // Create Category documents for each unique category
        for (const cat of uniqueCategories) {
            if (cat) { // Skip null or undefined categories
                const existing = await Category.findOne({ name: cat.toLowerCase() });
                if (!existing) {
                    await Category.create({ name: cat.toLowerCase() });
                    console.log(`Created category: ${cat}`);
                } else {
                    console.log(`Category already exists: ${cat}`);
                }
            }
        }

        console.log('Category migration completed');
    } catch (error) {
        console.error('Error during category migration:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

migrateCategories();