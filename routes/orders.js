const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('./cors');
const orders = require('../models/orders');




const ordersRouter = express.Router();

ordersRouter.use(bodyParser.json());


ordersRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions,(req, res, next) => {
        orders.find({})
            .then((Scholarships) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Scholarships);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions,
         (req, res, next) => {
            orders.create(req.body)
            .then((orders) => {
                console.log('orders created: ', orders);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(orders);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /orders');
    })

    .delete(cors.corsWithOptions, (req, res, next) => {
        orders.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });



module.exports = ordersRouter;