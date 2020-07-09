import express, { Request, Response, Application } from 'express';
import { readHtml } from './util';
import * as bodyParser from "body-parser";
import { join } from 'path';

const dev: boolean = process.env.NODE_ENV === "dev";
const app: Application = express();
const port: number | string = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use('/', express.static(join(__dirname, dev ? '../public' : '../build')));
app.set('json spaces', 2);

app.get('/json', async (req: Request, res: Response) => {
  const html: string = await readHtml(req.query);
  res.send(html);
});

app.listen(port, function () {
  console.log(`pj is running on port ${port}`);
});
