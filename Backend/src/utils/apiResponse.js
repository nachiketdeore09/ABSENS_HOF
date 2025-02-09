class ApiResponse {
    static success(res, { statusCode = 200, message = "Success", data = null }) {
      const response = {
        success: true,
        message,
        ...(data && { data }),
        timestamp: new Date().toISOString()
      };
  
      return res.status(statusCode).json(response);
    }
  
    static error(res, { statusCode = 500, message = "Error", error = null }) {
      const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && error && { error }),
        timestamp: new Date().toISOString()
      };
  
      return res.status(statusCode).json(response);
    }
  }
  
  export default ApiResponse;