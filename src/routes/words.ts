import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
const router = express.Router();
const jsonParser = bodyParser.json();
import {WORDS_JSON_FILE} from '../constants/constants';
import fs from 'fs';
import {IWord, IWords} from '../types';

let words: IWord[] = [];

if (fs.existsSync(WORDS_JSON_FILE)) {
  const wordsData = fs.readFileSync(WORDS_JSON_FILE, 'utf8');
  const parsedUserData: IWords = JSON.parse(wordsData);
  words = parsedUserData.words;
}

router.get('/words', (req: Request, res: Response) => {
  const limit = req.query.limit
    ? parseInt(req.query.limit as string)
    : undefined;
  const result = limit ? words.slice(0, limit) : words;
  res.json(result);
});

router.post('/words/:id', jsonParser, (req: Request, res: Response) => {
  const newWord = req.body;
  words.push(newWord);
  fs.writeFileSync(WORDS_JSON_FILE, JSON.stringify({words: [...words]}));
  res.json(words);
});

router.delete('/words/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  words = words.filter((word) => word.id !== id);
  res.json(words);
});

router.patch('/words/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedWords = req.body;
  words = words.map((word) => {
    if (word.id === id) {
      return {...word, ...updatedWords};
    }
    return word;
  });
  res.json(words);
});

export default router;
