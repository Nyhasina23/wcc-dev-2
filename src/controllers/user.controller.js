
const { UserModel } = require('./../models/user.model')
const { ExchangeModel } = require('./../models/exchange.model')
const validator = require('validator');
const mongoose = require('mongoose')
const fs = require('fs');
const resizeImg = require('resize-img');
const localIpAddress = require("local-ip-address")
const { generateToken } = require('../modules/generateJwtToken');

class userController {
    static signup = async (req, res) => {
        try {

            let password = req.body.password;
            let name = req.body.name;
            let contact = req.body.contact;
            let toyName = req.body.toyName;
            let exchangeWith = req.body.exchangeWith;
            if (password && name && contact) {
                if (toyName && exchangeWith) {


                    if (validator.isAlpha(name, 'fr-FR', { ignore: ' ' })) {
                        if (password.length > 7) {
                            if (validator.isMobilePhone(contact) && contact.length > 9) {
                                const exist = await UserModel.findOne({ contact });
                                if (!exist) {
                                    if (validator.isAlphanumeric(toyName, 'fr-FR', { ignore: ' -' })) {
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
                                                    user: name,
                                                    name: toyName,
                                                    contact,
                                                })
                                                newExchange.save()
                                                const newUser = new UserModel({
                                                    password, name, contact, toys: [_id]
                                                })
                                                newUser.save()
                                                const token = generateToken(name, contact);

                                                res.send('This is your token => '+ token)
                                            } else {
                                                res.status(403).send('images error : Toy image required')
                                            }
                                        } else {
                                            res.status(403).send('exchangeWith error : Toy name must be alphanumeric')
                                        }
                                    } else {
                                        res.status(403).send('toyName Error : Toy name must be alphanumeric')
                                    }
                                } else {
                                    res.status(401).send('contact error : Phone number already in use')
                                }
                            } else {
                                res.status(403).send('contact error : Enter a valid mobile phone format')
                            }
                        } else {
                            res.status(403).send('password error : Password length must contains at least 8 characters')
                        }
                    } else {
                        res.status(403).send('name error : Please enter a valid name')
                    }

                } else {
                    res.status(403).send('toy fields error : toyname and exchangeWith fields are required')
                }
            } else {
                res.status(403).send('All these field are required: password, name, contact ')
            }
        } catch (err)  {
            res.status(500).send('Unexpected internal server error, please verify your inputs')
            console.log(err)

        }
    }
    static signin = async (req, res) => {
        try {
            
            let contact = req.body.contact;
            const password = req.body.password;
            const user = await UserModel.findOne({contact})
            if (user != null) {
                console.log(user)
                if(password == user.password){
                    const token = generateToken(user.name, user.contact);    
                    res.status(200).send('This is your token => '+ token)
                }else{
                    res.status(403).send('Wrong password')
                }
            }else{
                res.status(404).send('User does not exist, verify your login')
            }
        } catch (err) {
            res.status(500).send('Unexpected internal server error, please verify your inputs')
            console.log(err)
        }
    }
}

module.exports = { userController }