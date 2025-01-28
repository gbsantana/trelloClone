import axiosClient from './axiosClient'

const taskApi = {
  create: (boardId, params) => {
    console.log('Creating task with params:', params); // Log the request payload
    return axiosClient.post(`boards/${boardId}/tasks`, params);
  },
  updatePosition: (boardId, params) => axiosClient.put(
    `boards/${boardId}/tasks/update-position`,
    params
  ),
  delete: (boardId, taskId) => axiosClient.delete(`boards/${boardId}/tasks/${taskId}`),
  update: (boardId, taskId, params) => axiosClient.put(
    `boards/${boardId}/tasks/${taskId}`,
    params
  )
}

export default taskApi