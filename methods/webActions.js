var User = require('../models/user')
var Auction = require('../models/auction')
var Item = require('../models/item')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
var emailconfig = require('../config/emailconfig')
var dataActions = require('./dataActions')
const { sendMail } = require('../config/emailconfig')

var functions = {
    // Função para cadastrar novo usuário 
    addNew: function (req, res) {
        if ((!req.body.name) || (!req.body.password) || (!req.body.email) || (!req.body.cep) || (!req.body.telefone)) {
            res.render('login', { error: true, msg: 'Digite todos os campos, nenhum campo pode ficar vazio.' })
        }
        else {
            User.findOne({
                email: req.body.email
            }, function (err, user) {
                if (err) throw err
                if (!user) {
                    var newUser = User({
                        name: req.body.name,
                        password: req.body.password,
                        email: req.body.email,
                        cep: req.body.cep,
                        telefone: req.body.telefone,
                        reputation: -1,
                        counttransaction: 0
                    })
                    newUser.save(function (err, newUser) {
                        if (err) {
                            res.render('login', { error: true, msg: 'Erro na hora de salvar ' + err })
                        }
                        else {
                            res.render('login', { success: true })
                        }
                    })
                }
                else {
                    res.render('login', { error: true, msg: 'Usuário já cadastrado' })
                }
            }
            )
        }
    },
    // Função para fazer um lance, atualiza o maior lance e o histórico de lances
    bid: function (itemName, linkedAuction, bid, personName, personEmail, callback) {
        if ((!itemName) || (!linkedAuction) || (!bid)) {
            return callback(false)
        } else {
            Item.findOne({
                name: itemName,
                linkedAuction: linkedAuction
            }, function (err, item) {
                if (err) {
                    console.log('erro ' + err)
                    throw err
                }
                if (!item) {
                    return callback(false)
                }
                else {
                    if (bid <= item.price) {
                        return callback(false)
                    }
                    else {
                        var historic = []
                        historic = item.historic
                        historic.push(personName + "-" + bid)
                        if (item.historic != undefined) {
                            dataActions.sendnotificationemail(personName, item.hightestbidderEmail, item.name)
                        }
                        Item.findOneAndUpdate({
                            "name": item.name,
                            "itemOwner": item.itemOwner,
                            "linkedAuction": item.linkedAuction
                        },
                            {
                                $set: {
                                    "historic": historic,
                                    "hightestbidder": personName,
                                    "name": item.name,
                                    "price": bid,
                                    "imagens": item.imagens,
                                    "itemOwner": item.itemOwner,
                                    "linkedAuction": linkedAuction,
                                    "itemOwnerEmail": item.itemOwnerEmail,
                                    "description": item.description,
                                    "hightestbidderEmail": personEmail,
                                    "categories": item.categories
                                }
                            }, function (err) {
                                if (err) {
                                    return callback(false)
                                }
                                else {
                                    return callback(true)
                                }
                            })
                    }
                }
            }
            )
        }
    },
    // Função para cadastrar um item no banco de dados
    addNewItem: async function (name, price, itemOwner, linkedAuction, description, images, callback) {
        var email = localStorage.getItem('email')
        var newItem = Item({
            name: name,
            price: price,
            imagens: images,
            itemOwner: itemOwner,
            itemOwnerEmail: email,
            linkedAuction: linkedAuction,
            description: description,
            historic: undefined,
            hightestbidder: undefined,
            hightestbidderEmail: undefined,
            categories: undefined
        });
        newItem.save(function (err, newItem) {
            if (err) {
                console.log('Deu erro ' + err)
                return callback(false)
            }
            else {
                console.log('Deu certo')
                return callback(true)
            }
        })

    },
    // Função para cadastrar um leilão no banco de dados
    addNewAuction: function (name, items, owner, owneremail, endDate, description, time, callback) {
        var newAuction = Auction({
            name: name,
            items: items,
            owner: owner,
            emailowner: owneremail,
            endDate: endDate,
            description: description
        });
        dataActions.timeoutAuction(newAuction, time)
        newAuction.save(function (err, newAuction) {
            if (err) {
                console.log('deu o erro ' + err)
                return callback(false)
            }
            else {
                return callback(true)
            }
        })

    },
    // Função para encontrar um item, ele passa o nome do item, o dono e o leilão que ele está vinculado
    findItem: function (req, res) {
        console.log(req.body.name + req.body.itemOwner + req.body.linkedAuction)
        Item.findOne({
            name: req.body.name,
            itemOwner: req.body.itemOwner,
            linkedAuction: req.body.linkedAuction
        }, function (err, item) {
            if (err) throw err
            if (!item) {
                res.status(403).send({ sucess: false, msg: 'Falha ao procurar o item, item não existe ou os dados estão errados' })
            }
            else {
                res.json({ sucess: true, msg: 'Item encontrado.', item: item })
            }
        }
        )
    },
    // Autenticação do usuário, procura se o usuário existe e caso esse usuário exista verifica se a senha está certa
    authenticate: function (req, email, password, callback) {
        User.findOne({
            email: email
        }, function (err, user) {
            if (err) throw err
            if (!user) {
                req.flash('error_msg', 'Usuário não encontrado')
                return callback({ sucess: false, msg: 'Usuário não existe' })
            }
            else {
                user.comparePassword(password, function (err, isMatch) {
                    if (isMatch && !err) {
                        var token = jwt.encode(user, config.secret)
                        var decodedtoken = jwt.decode(token, config.secret)
                        req.flash('success_msg', 'Login feito com sucesso!')
                        localStorage.setItem('email', email)
                        return callback({ success: true, token: token, decodedtoken: decodedtoken })
                    }
                    else {
                        req.flash('error_msg', 'Senha incorreta.')
                        return callback({ success: false, msg: ' Autenticação falhou, senha errada' })
                    }
                })
            }
        }
        )
    },
    // Procura um tipo de objeto do banco e retorna 
    search: function (req, res, linkedAuction) {
        if ((!req.body.type) || (!req.body.obj)) {
            res.json({ success: false, msg: 'Preencha todos os campos' })
        }
        else {
            switch (req.body.type) {
                case "Leilão":
                    Auction.find({ "name": req.body.obj }, function (err, auction) {
                        if (err) res.redirect('/dashboard')
                        if (!auction) res.json({ success: false, msg: 'Nenhum leilão encontrado' })
                        else res.render('dashboard', { auctions: auction })
                    })
                    break;
                case "Item": Item.find({ "name": req.body.obj }, function (err, item) {
                    if (err) res.redirect('/dashboard')
                    if (!item) {
                        res.json({ success: false, msg: 'Nenhum item encontrado' })
                    } else
                        res.json({ success: true, msg: 'Item encontrado', item: item })
                })
                    break;
                case "Usuário": User.find({ "name": req.body.obj }, function (err, user) {
                    if (err) res.redirect('/dashboard')
                    if (!user) res.redirect('/dashboard')
                    else res.render('dashboard', { user: true, users: user })
                })
                    break;
                default:
                    res.json({ success: false, msg: 'Tipo errado' })
            }
        }
    },
    searchItems: function (req, res, callback) {
        if (!req.body.linkedAuction) {
            res.json({ success: false, msg: 'Não passou o leilão.' })
        } else {
            Item.find({ linkedAuction: req.body.linkedAuction }, function (err, items) {
                if (err) throw err
                else {
                    if (!items) {
                        console.log('Estou retornando nada')
                        return callback(null)
                    } else {
                        console.log('Estou retornado ' + items)
                        return callback(items)
                    }
                }
            })
        }
    },
    sendmsg: function (msg, user, item, linkedAuction, callback) {
        Item.findOne({
            name: item,
            linkedAuction: linkedAuction
        }, function (err, item) {
            if (err) {
                console.log('erro ' + err)
                throw err
            }
            if (!item) {
                return callback(false)
            }
            else {
                var decodedMsg = user + ' - ' + msg
                var forum = []
                console.log('a msg ' + msg)
                if (item.forum == undefined) {
                    forum.push({ mensagem: decodedMsg })
                }
                else {
                    forum = item.forum
                    forum.push({ mensagem: decodedMsg })
                }
                console.log('o forum ficou assim ' + forum)
                Item.findOneAndUpdate({
                    "name": item.name,
                    "itemOwner": item.itemOwner,
                    "linkedAuction": item.linkedAuction
                },
                    {
                        $set: {
                            "historic": item.historic,
                            "hightestbidder": item.hightestbidder,
                            "name": item.name,
                            "price": item.price,
                            "imagens": item.imagens,
                            "itemOwner": item.itemOwner,
                            "linkedAuction": item.linkedAuction,
                            "itemOwnerEmail": item.itemOwnerEmail,
                            "description": item.description,
                            "hightestbidderEmail": item.hightestbidderEmail,
                            "categories": item.categories,
                            "forum": forum
                        }
                    }, function (err) {
                        if (err) {
                            return callback(false)
                        }
                        else {
                            return callback(true)
                        }
                    })

            }
        }
        )
    },
    finishauction: function (req, res) {
        var id = localStorage.getItem('id')
        Auction.findByIdAndRemove(id, function (err, auc) {
            if (err) res.render('dashboard', { error: true, msg: 'Houve um erro na hora de encerrar o leilão.' })
            else {
                if (!auc) {
                    res.redirect('/dashboard')
                } else {
                    for (let i = 0; i < auc.items.length; i++) {
                        dataActions.deleteItem(auc.name, auc.owner, auc.emailowner)
                    }
                    dataActions.sendEmail()
                    res.redirect('/dashboard')
                }

            }
        })
    },
    editauction: function (req, res) {
        res.render('editauction')
    },
    chat: function (req, res) {
        res.render('chat')
    }
}

module.exports = functions