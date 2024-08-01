import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
const router = express.Router();
const jsonParser = bodyParser.json();
import {USERS_JSON_FILE} from '../constants/constants';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import {IAuth, IUserData} from '../types';
import {getUsernameFromEmail} from '../utils/getUsernameFromEmail';

let users: IAuth[] = [];

if (fs.existsSync(USERS_JSON_FILE)) {
  const userData = fs.readFileSync(USERS_JSON_FILE, 'utf8');
  const parsedUserData: IUserData = JSON.parse(userData);
  users = parsedUserData.users;
}

router.get('/', (req: Request, res: Response) => {
  res.json(`users:  ${JSON.stringify(users)} `);
});

router.post('/login', jsonParser, async (req: Request, res: Response) => {
  const {email, password, id}: IAuth = await req.body;
  try {
    const user = users.some((e) => e.email === email);
    if (user) {
      const token = jwt.sign({email, password}, `${id}`);
      return res
        .status(200)
        .json({token: token, name: getUsernameFromEmail(email)});
    } else {
      return res.status(400).json('Не верный email или пароль');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send(error.message);
    } else {
      return res.status(500).send(String(error));
    }
  }
});

router.post('/register', jsonParser, async (req: Request, res: Response) => {
  const {email, password, id}: IAuth = await req.body;
  try {
    const user = users.some((user) => user.email === email);
    if (user) {
      return res.status(400).json('Email уже используется');
    }

    users.push({email, password, id});
    fs.writeFileSync(USERS_JSON_FILE, JSON.stringify({users: [...users]}));
    const token = jwt.sign({email, password}, `${id}`);
    return res
      .status(200)
      .json({token: token, name: getUsernameFromEmail(email)});
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send(error.message);
    }
    return res.status(500).send(String(error));
  }
});

export default router;
