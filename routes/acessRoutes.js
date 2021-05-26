const express = require('express')
const router = express.Router()
const Auction = require('../models/auction')
const User = require('../models/user')
const Item = require('../models/item')
const webActions = require('../methods/webActions')
const actions = require('../methods/actions')
const Transaction = require('../models/transaction')

//@desc Retorna o item do id
//@route GET /item/id
router.get('/item/:id', (req, res) => {
    Item.findById(req.params.id, function (err, item) {
        if (err) res.json({ sucess: false, msg: 'Houve um erro' })
        else if (!item) res.json({ sucess: false, msg: 'Item não encontrado' })
        else {
            var categorias = item.categories.toString()
            var hightestbidder = item.hightestbidder
            var historic = item.historic
            var forum = item.forum
            localStorage.setItem('id', req.params.id)
            if (item.imagens == null) res.redirect('/dashboard')
            else {
                if (item.imagens.length == 1) {
                    res.render('item', {
                        name: item.name,
                        price: item.price,
                        imagens: item.imagens,
                        categorias: categorias,
                        description: item.description,
                        image1: item.imagens[0],
                        linkedAuction: item.linkedAuction,
                        historic: historic,
                        hightestbidder: hightestbidder,
                        messages: forum
                    })
                } else {
                    res.render('item', {
                        name: item.name,
                        price: item.price,
                        imagens: item.imagens,
                        categorias: categorias,
                        description: item.description,
                        image1: 'data:image/jpeg;base64,' + item.imagens[0],
                        image2: 'data:image/jpeg;base64,' + item.imagens[1],
                        image3: 'data:image/jpeg;base64,' + item.imagens[2],
                        image4: 'data:image/jpeg;base64,' + item.imagens[3],
                        linkedAuction: item.linkedAuction,
                        historic: historic,
                        hightestbidder: hightestbidder, messages: forum
                    })
                }
            }
        }
    })
})

//@desc Retorna o usuário do id
//@route GET /user/id
router.get('/user/:id', (req, res) => {
    User.findById(req.params.id, function (err, user) {
        if (err) res.redirect('dashboard')
        else if (!user) res.redirect('dashboard')
        else {
            var name = user.name
            var cep = user.cep
            var cell = user.telefone
            var email = user.email
            res.render('user', {
                name: name,
                cell: cell,
                cep: cep,
                email: email
            })
        }
    })
})

//@desc Retorna o auction do id
//@route GET /auction/id
router.get('/auction/:id', (req, res) => {
    Auction.findById(req.params.id, function (err, auction) {
        if (err) res.json({ sucess: false, msg: 'Houve um erro' })
        else if (!auction) res.redirect('/dashboard')
        else {
            Item.find().lean().then((items) => {
                var auctionItems = []
                items.forEach(function (item, index) {
                    if (item.linkedAuction == auction.name) {
                        auctionItems.push(item)
                    }
                })
                var name = auction.name
                var endDate = auction.endDate
                var description = auction.description
                var owner = auction.owner
                var email = localStorage.getItem('email')
                if (auction.emailowner == email)
                    var admin = true
                else
                    var admin = false
                localStorage.setItem('id', req.params.id)
                res.render('auction', {
                    name: name,
                    endDate: endDate,
                    items: auctionItems,
                    description: description,
                    owner: owner,
                    admin: admin
                })
            }).catch((err) => {
                console.log(err)
                res.redirect('/dashboard')
            })
        }
    })
})

//@desc Retornando todos os leilões cadastrados no banco
//@desc GET /getauctions
router.get('/getauctions', (req, res) => {
    Auction.find(function (err, auction) {
        res.json(auction)
    })
})

//@desc Retornando todos os itens cadastrados no banco
//@desc GET /getitens
router.get('/getitens', (req, res) => {
    Item.find(function (err, auction) {
        res.json(auction)
    })
})

//@desc Dar um lance
//@route POST /bid
router.post('/bid/:name/:linkedAuction', (req, res) => {
    var email = localStorage.getItem('email')
    User.findOne({ email: email }, function (err, user) {
        if (err) console.log('Deu erro')
        webActions.bid(req.params.name, req.params.linkedAuction, req.body.bid, user.name, user.email, function (success) {
            if (success) {
                var id = localStorage.getItem('id')
                res.redirect('/item/' + id)
            } else {
                Auction.find().lean().then((auctions) => {
                    res.render('dashboard', {auctions: auctions, error:true, msg: 'Houve um erro na hora de processar seu lance, dê um lance maior do que o preço.'})
                }).catch((err)=>{
                    res.redirect('/')
                })
            }
        })
    })
})

router.post('/sendmsg/:name/:linkedAuction', (req, res) => {
    var email = localStorage.getItem('email')
    console.log('index, a msg ' + req.body.msg)
    User.findOne({ "email": email }, function (err, user) {
        webActions.sendmsg(req.body.msg, user.name, req.params.name, req.params.linkedAuction, function (success) {
        })
    })
    var id = localStorage.getItem('id')
    res.redirect('/item/' + id)
})

router.post('/searchItemsWeb', webActions.searchItems)

router.post('/transaction/:id/:involvedEmail/:negotiatorEmail', (req,res)=>{
    User.findOne({"email": req.params.involvedEmail}, function(err, user){
    var count = user.counttransaction + 1
    User.findOneAndUpdate({
        "email": user.email
    },
        {
            $set: {
                "counttransaction": count
            }
        }, function (err) {
            if(err) throw err
        })
   })
    
   User.findOne({"email": req.params.involvedEmail}, function(err,user){
    var media = user.reputation
    if(media == -1){
        media = req.body.note
    }else{
        media = req.body.note + user.reputation
        media = media/2
        console.log('a reputação' + user.reputation)
        console.log('a media é ' + media)
    } 
    User.findOneAndUpdate({
        "email": user.email
    },
        {
            $set: {
                "reputation": media
            }
        }, function (err) {
            if(err) throw err
        })
   })

   Transaction.findByIdAndUpdate(req.params.id, {$set:{ rated: true, note: req.body.note}}, function(err,trans){
       if (err) throw err
   })
   res.redirect('/mytransactions')
})

module.exports = router