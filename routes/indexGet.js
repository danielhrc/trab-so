const express = require('express')
const actions = require('../methods/actions')
const webActions = require('../methods/webActions')
const dataActions = require('../methods/dataActions')
const router = express.Router()
const Auction = require('../models/auction')
const User = require('../models/user')
const Item = require('../models/item')
const Transaction = require('../models/transaction')
const fs = require('fs')
var FileReader = require('filereader')
  , fileReader = new FileReader()
  ;

const { resolve } = require('path')
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  router.get('/faq',(req,res)=>{res.render('faq')})

router.get('/finishauction', webActions.finishauction)

router.get('/editauction', webActions.editauction)

//@desc Redirecionamento para a tela de registro de leilão
//@route GET /registerauction
router.get('/registerauction/', (req,res) => {res.render('addauction')})

//@desc Logout do usuário
//@route GET /logout
router.get('/logout', (req,res) => {
    localStorage.clear()
    res.redirect('./')
})


//@desc Redirecionamento da tela de cadastro de itens
//@route GET /additemweb
router.get('/additemweb', (req,res) =>{ 
    var linkedAuction = localStorage.getItem('nameAuction')
    var img = localStorage.getItem('img' + linkedAuction)
    if (img == null){
        res.render('additem', {error:true, msg:'Salve a imagem do seu item.'})
    }
    if(req.body.name == undefined){
        res.render('additem', {error:true, msg:'Houve um erro na hora de salvar o item.'})
    }else{
        var email = localStorage.getItem('email')
        if(email == null)
           res.redirect('/',{error:true, msg:'Faça o login para ter acesso ao site'})
        else{ 
            var email = localStorage.getItem('emaill')
                User.find({email: email}, function(err, user){
                   
                    webActions.addNewItem(req.body.name, req.body.price, user.name, linkedAuction, req.body.description,img, function(success){
                        if(success == true){
                            localStorage.removeItem('img' + linkedAuction)
                            var items = localStorage.getItem('items')
                            localStorage.removeItem('items')
                            if(items == null){
                                localStorage.setItem('items', req.body.name + ',')
                            }else{
                                localStorage.setItem('items', items + req.body.name + ',')
                            }
                            res.render('additem', {success: true})
                        }else{
                            res.render('additem', {error: true, msg:'Item não foi cadastrado'})
                        }
                    })
                })
            
        
        }    
    }
    
}
)

//@desc Dashboard
//@route GET /dashboard
router.get('/dashboard', (req,res) => {
    var email = localStorage.getItem('email')
    if(email == null)
    res.redirect('/',{error:true, msg:'Faça o login para ter acesso ao site'})
    else{
        Auction.find().lean().then((auctions) => {
            res.render('dashboard', {auctions: auctions})
        }).catch((err)=>{
            res.redirect('/')
        })
    } 
})

//@desc Dashboard
//@route GET /dashboard
router.get('/myauctions', (req,res) => {
    var email = localStorage.getItem('email')
    if(email == null)
    res.redirect('/',{error:true, msg:'Faça o login para ter acesso ao site'})
    else{
        User.findOne({"email": email}, function(err,user){
            Auction.find({"owner":user.name}).lean().then((auctions) => {
                res.render('dashboard', {auctions: auctions})
            }).catch((err)=>{
                res.redirect('/dashboard')
            })
        })
    } 
})

router.get('/mytransactions', (req,res) => {
    var email = localStorage.getItem('email')
    if(email == null)
    res.redirect('/',{error:true, msg:'Faça o login para ter acesso ao site'})
    else{
        Transaction.find({"involvedEmail": email}).lean().then((trans) =>{
            res.render('transaction', {transactions: trans})
        })
    } 
})

router.get('/chatWeb', (req,res) => {  res.render('chat')})

//@desc Retornando todos os leilões cadastrados no banco
//@desc GET /getauctions
router.get('/teste', (req,res) =>{
    var newTransaction = Transaction({
       involved: 'Urza',
       negotiator: 'Karn',
       negotiatorEmail:'email',
       involvedEmail:'email2',
       note: -1,
       rated: false
    })
    newTransaction.save(function(err, trans){
        if (err) console.log('erro ' + err)
    })
})

//@desc Rota padrão
//@route GET /
router.get('/', (req, res) => {res.render('login')})

module.exports = router