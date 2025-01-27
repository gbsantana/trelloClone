import axiosClient from './axiosClient';

const sectionApi = {
  create: async (boardId) => {
    try {
      return await axiosClient.post(`boards/${boardId}/sections`);
    } catch (err) {
      console.error('Error creating section:', err.response || err.message);
      throw err;
    }
  },
  update: async (boardId, sectionId, params) => {
    try {
      return await axiosClient.put(`boards/${boardId}/sections/${sectionId}`, params);
    } catch (err) {
      console.error('Error updating section:', err.response || err.message);
      throw err;
    }
  },
  delete: async (boardId, sectionId) => {
    try {
      return await axiosClient.delete(`boards/${boardId}/sections/${sectionId}`);
    } catch (err) {
      console.error('Error deleting section:', err.response || err.message);
      throw err;
    }
  },
};

export default sectionApi;
