const winston = require("winston");
const { createLogger, format, transports } = winston;
const config = require("config");

//Logger for file will not be colorized, but it will be saved as a json
const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      filename: config.get("logging.error.path"),
      level: "error",
      maxsize: config.get("logging.error.maxsize"),
      maxFiles: config.get("logging.error.maxFiles"),
      handleExceptions: true
    }),
    new transports.File({
      filename: config.get("logging.warning.path"),
      level: "warning",
      maxsize: config.get("logging.warning.maxsize"),
      maxFiles: config.get("logging.warning.maxFiles")
    }),
    new transports.File({
      filename: config.get("logging.info.path"),
      maxsize: config.get("logging.info.maxsize"),
      maxFiles: config.get("logging.info.maxFiles")
    })
  ]
});

//Logger for console will not be displayed as json, but it will be colorized
//Moreover - logging on console is not active on production enviroment!!
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
      handleExceptions: true
    })
  );
}

module.exports = logger;