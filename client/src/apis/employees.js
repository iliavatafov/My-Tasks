import * as request from "./requester";

const baseUrl = "https://my-task-ilia-vatafov.onrender.com/employees";

const url = {
  getAll: baseUrl,
  getTopFive: baseUrl + "/top-bottom-employees",
  getOne: (employeeId) => baseUrl + `/${employeeId}`,
  createEmployee: baseUrl,
  eployeeEdit: (employeeId) => baseUrl + `/${employeeId}`,
  deleteEmployee: (employeeId) => baseUrl + `/${employeeId}`,
};

export const getAllEmployees = async () => {
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

export const getEmployeeById = async (employeeId) => {
  try {
    const result = await request.get(url.getOne(employeeId));
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

export const getTopBottomEmployees = async () => {
  try {
    const result = await request.get(url.getTopFive);
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

export const createEmployee = async (employeeData) => {
  try {
    const result = await request.post(url.createEmployee, employeeData);
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

export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const result = await request.put(url.eployeeEdit(employeeId), employeeData);
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

export const deleteEmployee = async (employeeId) => {
  try {
    const result = await request.del(url.deleteEmployee(employeeId));

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
