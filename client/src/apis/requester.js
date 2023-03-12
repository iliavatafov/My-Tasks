export const request = async (method, url, data) => {
  try {
    const authData = localStorage.getItem("auth");
    const auth = JSON.parse(authData || `{}`);

    const headers = {};

    if (auth.accessToken) {
      headers["X-Authorization"] = auth.accessToken;
    }

    let buildRequest;

    if (method === "GET") {
      buildRequest = fetch(url, { headers });
    } else {
      buildRequest = fetch(url, {
        method,
        headers: {
          ...headers,
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }

    const response = await buildRequest;

    if (response.status !== 204) {
      const result = await response.json();
      return {
        data: result,
        success: response.ok,
      };
    } else {
      return {
        data: [{ msg: "Record deleted successfully" }],
        success: response.ok,
      };
    }
  } catch (error) {
    console.log(error.message);
    return {
      data: [{ msg: "Somthing went wrong" }],
      success: false,
    };
  }
};

export const get = request.bind({}, "GET");
export const post = request.bind({}, "POST");
export const put = request.bind({}, "PUT");
export const del = request.bind({}, "DELETE");
