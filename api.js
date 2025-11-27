import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // substitua pelo IP do seu servidor se for no celular
});
