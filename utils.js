const ipLoggerMiddleware = (req, res, next) => {
    console.log("=== IP Debug Info ===");
    console.log("req.ip:", req.ip);
    console.log("req.socket.remoteAddress:", req.socket.remoteAddress);
    console.log("X-Forwarded-For Header:", req.headers["x-forwarded-for"]);
    console.log("=====================");
    debugger
    next();
}


export {
    ipLoggerMiddleware
}