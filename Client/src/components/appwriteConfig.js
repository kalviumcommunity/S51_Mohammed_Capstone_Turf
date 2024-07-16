import { Client, Account } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_ID);

export const account = new Account(client);
export { client }; // Exporting the client separately

export default { client }; // Exporting an object with `client` as a property (optional)
