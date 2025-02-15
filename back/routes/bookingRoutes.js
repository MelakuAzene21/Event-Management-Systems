const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken'); // Adjust the path
const Booking = require('../models/Booking'); // Adjust the path    
const Event = require('../models/Event'); // Adjust the path

router.post("/create-booking", verifyToken, async (req, res) => {

try {
    req.body.user = req.user._id;
//create a booking
    const booking = await Booking.create(req.body);

    //update event tickets
    const event = await Event.findById(req.body.event);
    const ticketType=event.ticketTypes

    const updatedTicketsTypes = ticketType.map(ticketType => {
        if (ticketType.name === req.body.ticketType) {
            ticketType.booked=Number(ticketType.booked ?? 0)+Number(req.body.ticketsCount);
        ticketType.avaliable=Number(ticketType.avaliabale ?? ticketType.limit)-Number(express.request.body.ticketsCount)
        }
        return ticketType;
    });
    await Event.findByIdAndUpdate(req.body.event,{
        ticketTypes: updatedTicketsTypes,

    })
return res.status(201).json({message:"Booking Successfuuly",booking})
}catch (error) {

    return res.status(500).json({message:error.message})
}
})
model.exports = router;