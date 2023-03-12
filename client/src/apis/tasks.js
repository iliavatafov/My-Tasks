import * as request from "./requester";

const baseUrl = "http://localhost:5000/tasks";

const url = {
  getAll: baseUrl,
  getOne: (taskId) => baseUrl + `/${taskId}`,
  createTask: baseUrl,
  updateTask: (taskId) => baseUrl + `/${taskId}`,
  deleteTask: (taskId) => baseUrl + `/${taskId}`,
};

export const getAllTasks = async () => {
  try {
    const result = await request.get(url.getAll);
    if (result.success) {
      return {
        success: true,
        msg: [{ msg: "Request is fulfiled" }],
        data: result.data,
      };
    } else {
      return {
        success: false,
        msg: result.data,
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const getTaskById = async (taskId) => {
  try {
    const result = await request.get(url.getOne(taskId));
    if (result.success) {
      return {
        success: true,
        msg: [{ msg: "Request is fulfiled" }],
        data: result.data,
      };
    } else {
      return {
        success: false,
        msg: result.data,
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const createTask = async (taskData) => {
  try {
    const result = await request.post(url.createTask, taskData);
    if (result.success) {
      return {
        success: true,
        msg: [{ msg: "Request is fulfiled" }],
        data: result.data,
      };
    } else {
      return {
        success: false,
        msg: result.data,
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: [{ msg: "Somthing went wrong" }],
    };
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const result = await request.put(url.updateTask(taskId), taskData);
    if (result.success) {
      return {
        success: true,
        msg: [{ msg: "Request is fulfiled" }],
        data: result.data,
      };
    } else {
      return {
        success: false,
        msg: result.data,
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: [{ msg: "Somthing went wrong" }],
    };
  }
};

export const deleteTask = async (taskId) => {
  try {
    const result = await request.del(url.deleteTask(taskId));

    if (result.success) {
      return {
        success: true,
        msg: result.data,
      };
    } else {
      return {
        success: false,
        msg: result.data,
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: [{ msg: "Somthing went wrong" }],
    };
  }
};
