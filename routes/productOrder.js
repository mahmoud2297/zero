const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('./cors');
const productOrder = require('../models/productOrder');




const productOrderRouter = express.Router();

productOrderRouter.use(bodyParser.json());


productOrderRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions,(req, res, next) => {
        productOrder.find({})
            .then((Scholarships) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Scholarships);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions,
         (req, res, next) => {
            productOrder.create(req.body)
            .then((orders) => {
                console.log('orders created: ', orders);
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'mahmoud.helal.2297@gmail.com',
                        pass: 'me5746255doO'
                    }
                });
                let mailOptions = {
                    from: orders.email, // sender address
                    to: "haspulatmobilya@gmail.com", // list of receivers
                    subject: orders.email, // Subject line
                    text: "hello", // plain text body
                    html: '<b>'+ orders.message +'</b>' // html body
                };
          
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(orders);
                    });

            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /orders');
    })

    .delete(cors.corsWithOptions, (req, res, next) => {
        productOrder.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });



module.exports = productOrderRouter;