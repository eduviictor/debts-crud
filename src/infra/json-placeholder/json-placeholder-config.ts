require('dotenv').config();

export const JsonPlaceHolderConfig = {
  url: process.env.SWAPI_URL || 'https://jsonplaceholder.typicode.com',
  headers: {},
};
