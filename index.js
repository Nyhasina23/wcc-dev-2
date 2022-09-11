const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = require('./src/app');

const PORT = process.env.PORT;
app.set('port',PORT);

app.listen(PORT,()=>{
    console.log(`Server open on port ${PORT}`);
})