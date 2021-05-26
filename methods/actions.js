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
            res.json({success: false, msg: 'Preencha todos os campos'})
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
                                res.json({success: false, msg: 'Falha ao gravar o usuário.'})
                            }
                            else {
                                res.json({success: true, msg: 'Usuário gravado com sucesso.'})
                            }
                        })
                      }
                    else {
                        res.json({success: false, msg: 'Usuário já cadastrado'})
                    }
            }
            )           
        }
    },
    // Função para fazer um lance, atualiza o maior lance e o histórico de lances
    bid: function(req,res){
       if(!req.body.itemName || !req.body.linkedAuction || !req.body.bid){
           res.json({success:false, msg:'Preencha todos os campos.'})
       }else{
        Item.findOne({
            name: req.body.itemName,
            linkedAuction: req.body.linkedAuction
           }, function(err, item){
               if(err) throw err
               if(!item){
                   res.status(403).send({success: false, msg: 'Falha ao procurar o item, item não existe ou os dados estão errados'})
               }
               else{
                if(req.body.bid <= item.price)
                res.json({success:false, msg:'Valor menor ou igual ao valor atual, dê um lance maior'})
               else{
                var historic = []
                historic = item.historic
                historic.push(req.body.hightestbidder + "-" +req.body.bid)
                 Item.findOneAndUpdate({
                     "name": item.name,
                     "itemOwner": item.itemOwner,
                     "linkedAuction": item.linkedAuction },
                     {
                         $set:{
                             "historic": historic,
                             "hightestbidder": req.body.hightestbidder,
                             "name": item.name,
                             "price": req.body.bid,
                             "imagens": item.imagens,
                             "itemOwner": item.itemOwner,
                             "linkedAuction": req.body.linkedAuction,
                             "description": item.description,
                             "hightestbidderEmail": req.body.hightestbidderEmail,
                             "categories": item.categories
                         }
                     
                 },function(err){
                     if(err)
                     res.json({success:false, msg:'Não atualizou'})
                     else
                     res.json({success:true, msg:'Lance computado'})
                 })
               }
            }
           }
           )
       }
    },
    // Função para enviar email para o comprador e vencedor
    sendemail: function(item, winner, owner){
             var mailOption1 = {
              from: ' plataformadeleiloesleilon@gmail.com',
              to: owner,
              subject: 'Você vendeu o item ' + item,
              text: 'O seu item foi vendido para ' + winner + ', entre em contato para finalizar a venda.'
             }
             var mailOption2 = {
                from: ' plataformadeleiloesleilon@gmail.com',
                to: winner,
                subject: 'Você venceu o leilão do item ' + item,
                text: 'O item ' + item +' foi comprado por você, o dono é ' + owner + ', entre em contato para finalizar a venda.'
             }
             emailconfig.sendMail(mailOption1, function(error, info){
                if (error) {
                  res.json({success: false, msg: 'Email não foi enviado ', error: error})
                } else {
                    transporter.sendMail(mailOption2, function(error, info){
                        if (error) {
                            res.json({success: false, msg: 'Email não foi enviado ', error: error})
                        } else {
                            res.json({success:true, msg: info.response});
                        }
                      });
                }
              });
         
    },
    // Função para cadastrar um item no banco de dados
    addNewItem: async function (req, res) {
        if ((!req.body.name) || (!req.body.price)|| (!req.body.linkedAuction)|| (!req.body.imagens) || (!req.body.itemOwner) || (!req.body.description) || (!req.body.categories) ) {
               res.json({success: false, msg: 'Preencha todos os campos'})
           }
           else {
            for(i = 0; i < 4; i ++){
                    dataActions.generateImg(req.body.imagens[i], req.body.name + i)       
                } var newItem = Item({
                    name: req.body.name,
                    price: req.body.price,
                    imagens: req.body.imagens,
                    itemOwner: req.body.itemOwner,
                    linkedAuction: req.body.linkedAuction,
                    description: req.body.description,
                    historic: undefined,
                    hightestbidder: undefined,
                    hightestbidderEmail: undefined,
                    categories: req.body.categories
                });
                newItem.save(function (err, newItem) {
                    if (err) {
                        res.json({success: false, msg: 'Falha ao gravar o item ' + newItem.name})
                    }
                    else {
                       res.json({success: true, msg: 'Item gravado com sucesso ' + newItem.name})
                    }
                })
              }
       },
       // Função para cadastrar um leilão no banco de dados
    addNewAuction: function (req, res) {
        if ((!req.body.time) || (!req.body.name) || (!req.body.items)|| (!req.body.endDate) || (!req.body.owner)|| (!req.body.description)|| (!req.body.owneremail)) {
               res.json({success: false, msg: 'Preencha todos os campos'})
           }
           else {
            Auction.findOne({
                name: req.body.name
            }, function (err, auction) {
                if(!auction){
                    var newAuction = Auction({
                        name: req.body.name,
                        items: req.body.items,
                        owner: req.body.owner,
                        emailowner: req.body.owneremail,
                        endDate: req.body.endDate,
                        description: req.body.description
                    });
                  //  dataActions.timeoutAuction(newAuction, req.body.time)
                    newAuction.save(function (err, newAuction) {
                        if (err) {   
                         res.json({success: false, msg: 'Falha ao gravar o leilão' + newAuction.name})
                        }
                        else {
                            res.json({success: true, msg: 'Leilão gravado com sucesso ' + newAuction.name})
                        }
                    })
                } else {
                    res.json({success: false, msg:'Já possui um leilão com esse nome, espere ele encerrar ou escolha outro.'})
                }
            }) 
           }
       },
       // Função para encontrar um item, ele passa o nome do item, o dono e o leilão que ele está vinculado
       findItem: function(req, res){  
        console.log(req.body.name+ req.body.itemOwner+req.body.linkedAuction)
        Item.findOne({
            name: req.body.name,
            itemOwner: req.body.itemOwner,
            linkedAuction: req.body.linkedAuction
           }, function(err, item){
               if(err) throw err
               if(!item){
                   res.status(403).send({success: false, msg: 'Falha ao procurar o item, item não existe ou os dados estão errados'})
               }
               else{
                   res.json({success: true, msg:'Item encontrado.',item: item})
               }
           }
           )
       },
       // Autenticação do usuário, procura se o usuário existe e caso esse usuário exista verifica se a senha está certa
    authenticate: function (req, res,callback) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
                if (err) throw err
                if (!user) {
                    res.status(403).send({success: false, msg: 'Falha na autenticação, usuário não encontrado'})
                }
                else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(user, config.secret)
                            var decodedtoken = jwt.decode(token, config.secret)
                            res.json({success: true, token: token, decodedtoken: decodedtoken })
                        }
                        else {
                        res.status(403).send({success: false, msg: ' Autenticação falhou, senha errada'})
                        return callback(null, decodedtoken)   
                    }
                    })
                }
        }
        )
    },
    // Procura um tipo de objeto do banco e retorna 
    search: function (req, res) {
        if ((!req.body.type) || (!req.body.obj) ) {
            res.json({success: false, msg: 'Preencha todos os campos'})
        }
        else {
        switch(req.body.type){
            case "auction":
                Auction.find({name: req.body.obj}, function(err, auction){
                    if(err) res.json({success:false, msg: 'Houve um erro ' + err})
                    if(!auction) res.json({success:false, msg: 'Nenhum leilão encontrado'})
                    res.json({success:true, msg:'Leilão encontrado', leilão: auction})
                })
                break;
            case "item":Item.find({name: req.body.obj}, function(err, item){
                if(err) res.json({success:false, msg: 'Houve um erro ' + err})
                if(!item){
                    res.json({success:false, msg: 'Nenhum item encontrado'})
                }else
                 res.json({success:true, msg:'Item encontrado', item: item})
            })
            break;
            case "user":User.find({name: req.body.obj}, function(err, user){
                if(err) res.json({success:false, msg: 'Houve um erro ' + err})
                if(!user) res.json({success:false, msg: 'Nenhum usuário encontrado'})
                res.json({success:true, msg:'Usuário encontrado', Usuário: user})
            })
            break;
            default:
                res.json({success:false, msg:'Tipo errado'})
        }   
        }
    },
    searchItems: function(req, res){
       if(!req.body.linkedAuction){
           res.json({success:false, msg:'Não passou o leilão.'})
       }else{
           Item.find({linkedAuction: req.body.linkedAuction}, function(err, items){
               if(err) res.json({success:false, msg:'Ocorreu o erro ' + err})
               else{
                   if(!items){
                       res.json({success:false, msg:'Nenhum item encontrado'})
                   }else{
                       res.json({success:true, items: items})
                   }
               }
           })
       }
    },
    sendmsg: function(req,res){
        Item.findOne({
            name: req.body.item,
            linkedAuction: req.body.linkedAuction
           }, function(err, item){
               if(err) {
                   res.json({success:false, msg:'Houve um erro ' + err})
               }
               if(!item){
                res.json({success:false, msg:'Item não encontrado'})
               }
               else{
                var decodedMsg = req.body.user + ' - ' + req.body.msg
                var forum = []
                if (item.forum == undefined){
                    forum.push({mensagem: decodedMsg})
                }
                else{
                    forum = item.forum
                    forum.push({mensagem: decodedMsg})
                }
                Item.findOneAndUpdate({
                     "name": item.name,
                     "itemOwner": item.itemOwner,
                     "linkedAuction": item.linkedAuction },
                     {
                         $set:{
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
                 },function(err){
                     if(err){
                        res.json({success:false, msg:'Houve um erro ' + err})
                     }
                     else{
                        res.json({success:true, msg:'Mensagem postada com sucesso'})
                     }
                 })
               
            }
           }
           )
     }
}

async function sendnotificationemail(buyer, loser, item){
    var mailOption = {
     from: 'plataformaleiloesleilon@outlook.com',
     to: loser,
     subject: 'Seu lance no item ' + item + ' foi batido',
     text: 'Seu lance foi batido por ' + buyer +'.' + 
     'Acesse nosso site em leil-on.herokuapp.com'
    }

     if(buyer != undefined){
         emailconfig.sendMail(mailOption, function(error, info){
             if (error) {
                 console.log('erro ' + error)
                 throw error} 
             })  
           } 
              
}
module.exports = functions