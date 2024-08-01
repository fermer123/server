import express, {Express} from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import wordsRoutes from './routes/words';
import {createServer} from 'http';

const app: Express = express();
app.use(cors({origin: '*'}));
app.use(authRoutes);
app.use(wordsRoutes);
const index = createServer(app);

export default index;
