const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    content: {
        type: String,
        required: [true, 'Please add testimonial content'],
        maxlength: [500, 'Testimonial cannot be more than 500 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating'],
        min: 1,
        max: 5
    },
    service: {
        type: String,
        enum: ['wildlife', 'wedding', 'event', 'studio', 'outdoor', 'indoor'],
        required: true
    },
    avatar: {
        type: String,
        default: 'https://ui-avatars.com/api/?background=0D0D0D&color=e63946&size=100'
    },
    approved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);