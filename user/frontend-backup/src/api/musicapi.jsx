import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:1000/api' }); 




export const fetchSongs = () => API.get('/songs');
export const createPlaylist = (data) => API.post('/playlists', data);
export const fetchPlaylists = (userId) => API.get(`/playlists/user/${userId}`);
