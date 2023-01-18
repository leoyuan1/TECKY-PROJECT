import winston from "winston";

const logFormat = winston.format.printf(function (info) {
  let date = new Date().toISOString();
  return `${date}[${info.level}]: ${info.message}\n`;
});

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(winston.format.colorize(), logFormat),
  transports: [new winston.transports.Console()],
});

//   Error	Error means there is failure of something
//   Warn	Warning means something is going wrong. But it is still working
//   Info	Info means the text is for additional information.
//   Debug	Debug is for debugging. It is normally very tedious, so it is a common practice to filter debug log.