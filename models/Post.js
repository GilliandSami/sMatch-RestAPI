const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media_uri: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    location: {
        type: {
            type: String,
            enum: ['Point'], // Type GeoJSON : Point
            required: false
        },
        coordinates: {
            type: [Number], // Tableau [longitude, latitude]
            required: false,
            validate: {
                validator: function (value) {
                    return (
                        Array.isArray(value) &&
                        value.length === 2 &&
                        value[0] >= -180 && value[0] <= 180 && // Longitude
                        value[1] >= -90 && value[1] <= 90     // Latitude
                    );
                },
                message: '{VALUE} is not a valid longitude/latitude coordinates array',
            }
        }
    }
});

// Ajout de l'index géospatial
postSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Post', postSchema);