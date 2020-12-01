const express = require("express");
const { restart } = require("nodemon");
const { v4: uuid } = require('uuid');
const logger = require("../logger");
let store  = require("../store");

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route("/")
  .get((req, res) => {
    return res.status(200).json(store);
  })
  .post(bodyParser, (req, res) => {
    let { title, url, rating, desc } = req.body;
    if (!title) {
      logger.error("Title is required");
      return res.status(400).send("Title is required");
    }
    if (!url) {
      logger.error("URL is required");
      return res.status(400).send("URL is required");
    }
    if (url.match(/http(s)?:\/\/www\.[A-Za-z0-9]+.[A-Za-z]+/) == null) {
      logger.error("URL must match format 'http(s)://www.website.com(com, org, gov, etc.)'");
      return res.status(400).send("URL must match format 'http(s)://www.website.(com, org, gov, etc.)'");
    }
    const result = { title, url, id: uuid() };
    if (rating) {
      if (!Number.isInteger(rating)|| rating < 0 || rating > 5) {
        logger.error("Rating must be an integer between 0 and 5");
        return res.status(400).send("Rating must be an integer between 0 and 5");
      } else {
        result.rating = rating;
      }
    }
    if (desc) {
      result.desc = desc;
    }
    store.push(result)
    res.status(201)
    .location(`http://localhost:8000/bookmarks/${result.id}`)
    .json(result)
  });

  bookmarkRouter.route("/:id")
  .delete((req, res) => {
      const {id} = req.params 
      const beforeLength = store.length;
      store = store.filter((bookmark) => {
          return bookmark.id !== id 
      })
      if (beforeLength === store.length){
          logger.error("Id not found")
          return res.status(404).send("Id not found")
      }
      return res.status(204).end()
  }).get((req, res) => {
      const {id} = req.params 
      let cardIndex
      store.forEach((bookmark, index) => {
          if (bookmark.id === id){
            cardIndex = index
          }
      })
      if (cardIndex === undefined){
          logger.error("Card not found")
          return res.status(404).send("Card not found")
      }
      return res.status(200).json(store[cardIndex])
  })

  module.exports = bookmarkRouter