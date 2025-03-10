import express, { Application, Request, Response } from 'express';
const app: Application = express();
const port: number = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
