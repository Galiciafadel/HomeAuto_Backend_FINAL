var express = require('express');
const router = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');

const bodyParser = require('body-parser');
var User = require('../schemas/user');

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } );
router.get('/', cors.corsWithOptions, function(req,
                                                                           res,
                                                                           next) {
    User.find()
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err));
});

router.post('/signup', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.register(new User({username: req.body.username}),
        req.body.password, (err, user) => {
            if(err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            }
            else {
                if (req.body.firstname)
                    user.firstname = req.body.firstname;
                if (req.body.lastname)
                    user.lastname = req.body.lastname;
                user.save((err, user) => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return ;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful!', user: {_id: user._id, firstname: user.firstname, lastname: user.lastname, admin:user.admin}});
                    });
                });
            }
        });
});

router.post('/login', cors.corsWithOptions, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err)
            return next(err);
        
        if(!user){
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Login Unsucsessful', err: info});
        }
        req.logIn(user, (err) => {
            if(err){
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, status: 'Login Unsucsessful', err: 'Could not login user'});
            }

            var token = authenticate.getToken({_id: req.user._id});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, token: token, admin: user.admin, _id: user._id, status: 'You are successfully logged in!'});
        });
    }) (req, res, next);
});

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err)
            return next(err);

        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({status: 'JWT invalid!', success: false, err: info});
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({status: 'JWT valid!', success: true, user: user});

        }
    }) (req, res);
});


// router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
//     if (req.user) {
//         var token = authenticate.getToken({_id: req.user._id});
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json({success: true, token: token, status: 'You are successfully logged in!'});
//     }
// });

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const User = require('../schemas/user');
// const Bcrypt = require('bcryptjs');
// const responseHandler = require('../services/responseHandler');

// //ROUTES
// router.get('/',  (req, res, next) => {

//     User.find({}).then(users => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(users)})
//         .catch(err => next(err));


// });

// router.post('/login', (req, res, next) => {
//     try{
//         User.findOne({ username: req.body.username }).then(user => {
//             let authResponse = {};

//             if(!user) {
//                 authResponse = responseHandler.handleResponse(null, 404, false, 'user not found, wrong username');
//                 res.send(authResponse).status(404);
//                 return ;
//             }

//             Bcrypt.compare(req.body.password, user.password).then(
//                 hash => {
//                     if(!hash){
//                         authResponse = responseHandler.handleResponse(null, 404, false, 'user not found, wrong password');
//                         res.send(authResponse).status(404);
//                         return ;
//                     }

//                     authResponse = responseHandler.handleResponse(user, 200, true, 'user found');
//                     res.send(authResponse).status(200);
//                 })
//         })
//             .catch(err => next(err));

//     }
//     catch(err){
//         res.status(500).json({message: err});
//     }

// })

// router.post('/',  (req, res) => {
//     const user = new User({
//         username: req.body.username,
//         password: Bcrypt.hashSync(req.body.password),
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         isAdmin: req.body.isAdmin,
//     });
//     try{
//         const savedUser = user.save();
//         res.json(user);
//     }
//     catch(err){
//         res.json({message: err});
//     }

// });


// router.delete('/:userId', (req, res, next) => {
//     User.findByIdAndRemove(req.params.userId)
//         .then((resp) => {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(resp);
//         }, (err) => next(err))
//         .catch((err) => next(err));
// });

// module.exports = router;
