import log4js from "log4js";

const {
  NODE_ENV = "default",
  SLACK_DEBUGGER_TOKEN,
  SLACK_DEBUGGER_CHANNEL_ID,
  SLACK_DEBUGGER_USERNAME = "ѢѢ",
} = process.env;

const baseLayout = {
  type: "pattern",
  pattern: `%[[%p] %d{dd.MM.yyyy hh:mm:ss:SSS}%] - %m`,
};

const slackLayout = {
  type: "pattern",
  pattern: `[%h] [%p] %d{dd.MM.yyyy hh:mm:ss} - %m`,
};

const config: {
  appenders: {
    console: { type: string; layout: { type: string; pattern: string } };
    file: {
      type: string;
      layout: { type: string; pattern: string };
      filename: string;
      maxLogSize: number;
      backups: number;
      compress: boolean;
    };
    slack?: {
      type: string;
      token: string;
      channel_id: string;
      username: string;
      layout: { type: string; pattern: string };
    };
    slackInfo?: { type: string; level: string; appender: string };
  };
  categories: {
    default: { appenders: string[]; level: string };
    development: { appenders: string[]; level: string };
    production: { appenders: string[]; level: string };
  };
} = {
  appenders: {
    console: { type: "console", layout: baseLayout },
    file: {
      type: "file",
      layout: baseLayout,
      filename: "logs/app.log",
      maxLogSize: 10485760, // 10MB
      backups: 3,
      compress: true,
    },
  },
  categories: {
    default: { appenders: ["console", "file"], level: "debug" },
    development: { appenders: ["console"], level: "debug" },
    production: { appenders: ["console", "file"], level: "debug" },
  },
};

if (SLACK_DEBUGGER_TOKEN && SLACK_DEBUGGER_CHANNEL_ID) {
  config.appenders.slack = {
    type: "@log4js-node/slack",
    token: SLACK_DEBUGGER_TOKEN,
    channel_id: SLACK_DEBUGGER_CHANNEL_ID,
    username: SLACK_DEBUGGER_USERNAME,
    layout: slackLayout,
  };
  config.appenders.slackInfo = {
    type: "logLevelFilter",
    level: "info",
    appender: "slack",
  };

  config.categories.production.appenders.push("slackInfo");
}

log4js.configure(config);

export default log4js.getLogger(NODE_ENV);
