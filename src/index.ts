import './pre-start'; // Must be the first import
import logger from 'jet-logger';
import mongoose from 'mongoose';
import server from './server';

// // Start server
// server.listen(port, () => {
//     logger.info(serverStartMsg + port);
// });

(async () => {
    try {
        const port = process.env.PORT || 3030;
        mongoose.connect(process.env.MONGO_URL || '');
        await server.listen(port, () => console.log(`app is listening on port: ${port}`));
    } catch (e) {
        console.log(e);
    }
})();
