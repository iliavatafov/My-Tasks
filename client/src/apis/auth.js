import * as request from "./requester";

const baseUrl = "https://my-task-ilia-vatafov.onrender.com/users";

const url = {
  login: baseUrl + `/login`,
  register: baseUrl + `/register`,
  update: (userId) => baseUrl + `/${userId}`,
};

export const login = async (email, password) => {
  try {
    const result = await request.post(url.login, { email, password });
    if (result.success) {
      return {
        success: true,
        msg: [{ msg: "Login successful" }],
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

export const register = async (email, name, employeeId, password) => {
  try {
    const result = await request.post(url.register, {
      email,
      name,
      employeeId,
      password,
    });

    if (result.success) {
      return {
        success: true,
        msg: [{ msg: "Register successful" }],
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

export const updateAccount = async (
  userId,
  email,
  name,
  employeeId,
  password
) => {
  try {
    const result = await request.put(url.update(userId), {
      email,
      name,
      employeeId,
      password,
    });

    if (result.success) {
      return {
        success: true,
        msg: [{ msg: "Register successful" }],
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
