import paths from './paths';
import components from './components';
import schemas from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Debts Crud API',
    description: 'Documentation of a simple debts crud api.',
    version: '1.0.0',
    contact: {
      name: 'Eduardo Victor',
      email: 'eduvictornobrega@gmail.com',
      url: 'https://www.linkedin.com/in/eduviictor',
    },
  },
  externalDocs: {
    description: 'Repository link',
    url: 'https://github.com/eduviictor/debts-crud',
  },
  servers: [
    {
      url: '/',
      description: 'Server',
    },
  ],
  tags: [
    {
      name: 'Debts',
      description: 'Routes related to the debts',
    },
  ],
  paths,
  schemas,
  components,
};
