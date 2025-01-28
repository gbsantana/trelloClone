import axiosClient from './axiosClient'

const boardApi = {
  create: async () => {
    try {
      const response = await axiosClient.post('boards');
      console.log('API Response:', response); // Log API response
      return response;
    } catch (err) {
      console.error('API Error:', err); // Log error details
      throw err;
    }
  },
  getAll: () => axiosClient.get('boards'),
  updatePositoin: (params) => axiosClient.put('boards', params),
  getOne: (id) => axiosClient.get(`boards/${id}`),
  delete: (id) => axiosClient.delete(`boards/${id}`),
  update: (id, params) => axiosClient.put(`boards/${id}`, params),
  getFavourites: () => axiosClient.get('boards/favourites'),
  updateFavouritePosition: (params) => axiosClient.put('boards/favourites', params)
}

export default boardApi