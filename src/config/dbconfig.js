const mongoose = require('mongoose');
const connectionUrl = process.env.MONGO_URI;
mongoose.connect(
    connectionUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) console.log("erreur" + err);
        else console.log("MongoDB connected");
    }
)