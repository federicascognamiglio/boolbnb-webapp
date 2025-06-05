const errorsHandler = (err, req, res, next) => {
    const resObj = {
        status: "Internal Server Error",
        message: err.message,
        type: err.stack
    }
    if (process.env.environment === "development") {
        resObj.detail = err.stack;
    }
    return res.status(500).json(resObj);
}

module.exports = errorsHandler;