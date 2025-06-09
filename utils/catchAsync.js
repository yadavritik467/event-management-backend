export const catchAsync = (passedFunc) => async (req, res, next) => {
  try {
    await passedFunc(req, res, next);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log( 'Api Error',error);
    }
    next(error);
  }
};

export const sendResponse = (res, message, status = 200, data) => {
  return res.status(status).json({ statusCode:status,message, ...data });
};
