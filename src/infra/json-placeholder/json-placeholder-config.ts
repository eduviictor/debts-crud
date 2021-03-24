require('dotenv').config();

export const JsonPlaceHolderConfig = {
  url: process.env.JSON_PLACEHOLDER || 'https://jsonplaceholder.typicode.com',
  headers: {},
};
