/* Express App */
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import compression from "compression";

const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const NeDB = require("nedb");
const service = require("feathers-nedb");

const db = new NeDB({
  filename: "./db-data/celebrities",
  autoload: true
});

/* My express App */
export default function expressApp(functionName) {
  const routerBasePath =
    process.env.NODE_ENV === "dev"
      ? `/${functionName}`
      : `/.netlify/functions/${functionName}`;
  // Create an Express compatible Feathers application instance.
  const app = express(feathers());
  const router = express.Router;
  // Turn on JSON parser for REST services
  app.use(express.json());
  // Turn on URL-encoded parser for REST services
  app.use(express.urlencoded({ extended: true }));
  // Enable REST services
  app.configure(express.rest());
  // Connect to the db, create and register a Feathers service.

  // Set router base path for local dev
  app.use(
    `${routerBasePath}/celebrities`,
    service({
      Model: db,
      paginate: {
        default: 2,
        max: 4
      }
    })
  );

  //app
    //.service("messages")
    //.create({
      //text: "Message created on server"
    //})
    //.then(message => console.log("Created message", message));

  // Apply express middlewares
  return app;
}