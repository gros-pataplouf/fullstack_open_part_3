class HttpError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

class Error400 extends HttpError {
  constructor() {
    super("Bad request.", 400);
  }
}

class Error404 extends HttpError {
  constructor() {
    super("The ressource has not been found.", 404);
  }
}

class Error403 extends Error {
  constructor() {
    super("Forbidden.", 403);
  }
}

class Error500 extends Error {
  constructor() {
    super("Forbidden.", 500);
  }
}

const errorHandler = (error, request, response, next) => {
  if (error.code) {
    return response.status(error.code).send({ error: error.message });
  }

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

module.exports = {
  Error400,
  Error403,
  Error404,
  Error500,
  errorHandler,
};
