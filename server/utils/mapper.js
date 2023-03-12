function mapErrors(err) {
  if (err.code == 11000) {
    return [{ msg: "The email already exists" }];
  } else if (Array.isArray(err)) {
    return err;
  } else if (err.name == "ValidationError") {
    return Object.values(err.errors).map((e) => ({ msg: e.message }));
  } else if (typeof err.message == "string") {
    return [{ msg: err.message }];
  } else {
    return [{ msg: "Request error" }];
  }
}

module.exports = mapErrors;
