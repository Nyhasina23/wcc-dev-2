const { UserModel } = require('./../models/user.model')
const { ExchangeModel } = require('./../models/exchange.model')
const validator = require('validator');
const mongoose = require('mongoose')
const fs = require('fs');
const resizeImg = require('resize-img');
const localIpAddress = require("local-ip-address")
const { generateToken } = require('../modules/generateJwtToken');
const jwt_decode = require('jwt-decode')


const jwt = require('jsonwebtoken');
class exchangeController {
    static create = async (req, res) => {
        const name = req.body.name;
        const exchangeWith = req.body.exchangeWith;
        try {
            if (name && exchangeWith) {
                const head = await req.headers['authorization'];
                if (head && validator.contains(head, " ")) {
                    const token = head.split(' ')[1];
                    jwt.verify(token, process.env.SECRET, async (err) => {
                        if (err) {
                            res.status(403).send("Invalid token");
                        } else {
                            let user = jwt_decode(token).name;
                            let contact = jwt_decode(token).contact;
                            console.log(jwt_decode(token))
                            if (validator.isAlphanumeric(name, 'fr-FR', { ignore: ' -' })) {
                                if (validator.isAlphanumeric(exchangeWith, 'fr-FR', { ignore: ' -' })) {
                                    if (req.files.length) {
                                        const _id = new mongoose.Types.ObjectId();
                                        let imageFiles = [];
                                        for (let i = 0; i < req.files.length; i++) {
                                            const url = req.files[i].path;
                                            let image = await resizeImg(fs.readFileSync(url), {
                                                width: 600
                                            });
                                            fs.writeFileSync(url, image);
                                            imageFiles.push('http://' + localIpAddress() + ':' + process.env.PORT + '/' + req.files[i].filename);
                                        }
                                        const newExchange = new ExchangeModel({
                                            _id,
                                            exchangeWith,
                                            imageFiles,
                                            user,
                                            name,
                                            contact,
                                        })
                                        newExchange.save()
                                        const owner = await UserModel.findOne({ contact })
                                        owner.toys.push(_id)
                                        owner.save()
                                        res.send('Exchange created successfuly')
                                    } else {
                                        res.status(403).send('images error : Toy image required')
                                    }
                                } else {
                                    res.status(403).send('exchangeWith error : Toy name must be alphanumeric')
                                }
                            } else {
                                res.status(403).send('name Error : Toy name must be alphanumeric')
                            }
                        }
                    })
                } else {
                    res.status(403).send('Invalid token')
                }
            } else {
                res.status(401).send('Missing field : name and exchangeWith fields are required')
            }
        } catch (err) {
            console.log(err)
            res.status(500).send('Unexpected internal server error, please verify your inputs')
        }
    }
    static deactivate = async (req, res) => {
        try {
            const id = req.query.id;
            const head = await req.headers['authorization'];
            if (head && validator.contains(head, " ")) {
                const token = head.split(' ')[1];
                jwt.verify(token, process.env.SECRET, async (err) => {
                    if (err) {
                        res.status(403).send("Invalid token");
                    } else {
                        let exchange;
                        let contact = jwt_decode(token).contact;
                        try {
                            exchange = await ExchangeModel.findById(id);
                        } catch (error) {
                            exchange = null
                        }
                        if (exchange != null) {
                            if (contact == exchange.contact) {
                                if (exchange.status == 'active') {
                                    exchange.status = 'inactive'
                                    exchange.save()
                                    res.status(200).send('The exchange ' + id + ' is now inactive')
                                } else {
                                    res.status(200).send('The exchange ' + id + ' is already inactive')
                                }
                            } else {
                                res.status(403).send('You cannot deactivate the exchange ' + id + ' because this exchange is owned by ' + exchange.user)
                            }
                        } else {
                            res.status(404).send('This exchange does not exist')
                        }
                    }
                })
            } else {
                res.status(403).send('Invalid token')
            }

        } catch (error) {
            res.status(500).send('Unexpected internal server error, please verify your inputs')
            console.log(error)
        }
    }

    static getExchanges = async (req, res) => {
        try {
            let page = req.query.page;
            const count = await ExchangeModel.countDocuments({status:'active'});

            let maxPage =  Math.ceil(count/10)
            console.log()
            if ( validator.isInt(page.toString()) && page > 0 && page <= maxPage) {
                const exchanges = await ExchangeModel.find({ status: 'active' })
                    .limit(10).skip(10 * (page - 1));
                res.send(exchanges)
            }else{
                maxPage++
                res.status(401).send('Page must be a number between 0 and '+maxPage)
            }

        } catch (error) {
            console.log(error)
            res.status(500).send('Unexpected internal server error, please verify your inputs')
        }
    }
    static getUserExchanges = async (req, res) => {
        try {
            let page = req.query.page;
            const count = await ExchangeModel.countDocuments({status:'active'});

            let maxPage =  Math.ceil(count/10)
            if ( validator.isInt(page.toString()) && page > 0 && page <= maxPage) {
                const exchanges = await ExchangeModel.find({ status: 'active' })
                    .limit(10).skip(10 * (page - 1));
                res.send(exchanges)
            }else{
                maxPage++
                res.status(401).send('Page must be a number between 0 and '+maxPage)
            }

        } catch (error) {
            console.log(error)
            res.status(500).send('Unexpected internal server error, please verify your inputs')
        }
    }
}

module.exports = { exchangeController }