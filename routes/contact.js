const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('./cors');
const contact = require('../models/contact');




const contactRouter = express.Router();

contactRouter.use(bodyParser.json());


contactRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions,(req, res, next) => {
        contact.find({})
        .populate('comments.author')
            .then((Scholarships) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Scholarships);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions,
         (req, res, next) => {
            contact.create(req.body)
            .then((contact) => {
                console.log('contact created: ', contact);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(contact);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /contact');
    })

    .delete(cors.corsWithOptions, (req, res, next) => {
        contact.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


contactRouter.route('/sendEmail')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions,(req, res, next) => {
        contact.find({})
        .populate('comments.author')
            .then((Scholarships) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Scholarships);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions,
         (req, res, next) => {
            contact.create(req.body)
            .then((contact) => {
                
                console.log('contact created: ', contact);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(contact);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /contact');
    })

    .delete(cors.corsWithOptions, (req, res, next) => {
        contact.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = contactRouter;