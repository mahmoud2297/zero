const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require("../authenticate")
const cors = require('./cors');
const products = require('../models/products');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/products'); 
    },

    filename: (req, file, cb) => {
        cb(null,  Math.random() +file.originalname )
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFileFilter});



const productsRouter = express.Router();

productsRouter.use(bodyParser.json());


productsRouter.route('/upload')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions,upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file.path);
})


productsRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions,(req, res, next) => {
        products.find({})
            .then((Scholarships) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Scholarships);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions,(req, res, next) => {
            products.create(req.body)
            .then((contact) => {
                console.log('product created: ', contact);
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
        products.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


    productsRouter.route('/:scholarId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
        .get(cors.cors, (req, res, next) => {
            products.findById(req.params.scholarId)
            .populate('comments.author')
                .then((scholarship) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(scholarship);
                }, (err) => next(err))
                .catch((err) => next(err));
        })
    
        .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /Scholarships/'
                + req.params.scholarId);
        })
    
        .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
            products.findByIdAndUpdate(req.params.scholarId, {
                $set: req.body
            }, {
                    new: true
                })
                .then((scholarship) => {
                    console.log('scholarship updated: ', scholarship);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(scholarship);
                }, (err) => next(err))
                .catch((err) => next(err));
        })
    
        .delete( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
            products.findByIdAndRemove(req.params.scholarId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        })



module.exports = productsRouter;