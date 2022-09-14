import { SessionOptions } from "express-session";

const SIX_HOURS = 1000 * 60 * 60 * 6;

export const {
  SESSION_SECRET = "secret",
  SESSION_NAME = "sid",
  SESSION_TIMEOUT = SIX_HOURS,
} = process.env;

export const SESSION_OPTIONS: SessionOptions = {
  secret: SESSION_SECRET,
  name: SESSION_NAME,
  cookie: {
    maxAge: +SESSION_TIMEOUT,
    secure: process.env.NODE_ENV === "production",
  },
  resave: false,
  saveUninitialized: false,
  rolling: true, //roll the session i.e. keep it alive even after six hours if the user is active
};
