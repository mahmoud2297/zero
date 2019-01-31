const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('./cors');
const sendEmail = require('../models/sendEmail');

const sendEmailRouter = express.Router();
sendEmailRouter.use(bodyParser.json());
sendEmailRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions,(req, res, next) => {
        sendEmail.find({})
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
            sendEmail.create(req.body)
            .then((sendEmail) => {
                console.log('sendEmail created: ', sendEmail);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(sendEmail);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /sendEmail');
    })

    .delete(cors.corsWithOptions, (req, res, next) => {
        sendEmail.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = sendEmailRouter;