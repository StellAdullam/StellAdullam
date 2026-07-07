import app from './src';

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`StellAdullam API is running on port ${port}`);
console.log(`Swagger docs available at http://localhost:${port}/swagger`);
