var Auction = require('../models/auction')
var Item = require('../models/item')
var fs = require('fs')
const actions = require('./actions')
var Transaction = require('../models/transaction')

var functions = {
    timeoutAuction: async function timeoutAuction(auc, time) {
        console.log('o time é de ' + time)
        setTimeout(async function () {
            Auction.findOneAndDelete({
                name: auc.name,
                owner: auc.owner,
                endDate: auc.endDate,
                items: auc.items,
                description: auc.description,
                emailowner: auc.emailowner
            }, function (err) {
                for (i = 0; i < auc.items.length; i++) {
                    Item.findOneAndDelete({
                        name: auc.items[i],
                        linkedAuction: auc.name
                    }, function (err, item) {
                        if (err) throw err
                        actions.sendemail(item.name, item.hightestbidderEmail, auc.emailowner)
                    })
                }
                if (err) throw err
            })
        }, time)
    },
    generateImg: function (str, name) {
        var decodedStr = str.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync("./views/images/" + name + ".jpg", decodedStr, { encoding: 'base64' }, function (err) {
            if (err) throw err
            else console.log('Gerei a imagem')
        });
    },
    returnTime: function (yearA, monthA, dayA, callback) {
        const now = new Date(); // Data de hoje
        const past = new Date(yearA + '-' + monthA + '-' + dayA); // Data do término do leilão
        const diff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
        return callback(diff)
    },
    generateTransaction: async function (involved, negotiator, involvedEmail, negotiatorEmail) {
        console.log('envolvido' + involved)
        console.log('email dele' + involvedEmail)
        console.log('avaliando ' + negotiator)
        console.log('com o email' + negotiatorEmail)
        var newTransaction = Transaction({
            involved: involved,
            negotiator: negotiator,
            involvedEmail: involvedEmail,
            negotiatorEmail: negotiatorEmail,
            rated: false,
            note: undefined
        })
        newTransaction.save(function (err, trans) {
            if (err) throw err
            else console.log('Transação criada com sucesso.')
        })
    },
    deleteItem: async function (auction, owner, ownerEmail) {
        Item.findOneAndDelete({ linkedAuction: auction }, function (err, item) {
            if (err) throw err
            else {
                if (item.hightestbidder) {
                    sendEmail(item.name, item.hightestbidderEmail, item.itemOwnerEmail)
                    dataActions.generateTransaction(owner, item.hightestbidder, ownerEmail, item.hightestbidderEmail)
                    dataActions.generateTransaction(item.hightestbidder, owner, item.hightestbidderEmail, ownerEmail)
                }
            }
        })
    },
    sendnotificationemail: async function (buyer, loser, item) {
        if (!loser) {
            console.log('Primeiro lance')
        } else {
            var mailOption = {
                from: 'plataformaleiloesleilon@outlook.com',
                to: loser,
                subject: 'Seu lance no item ' + item + ' foi batido',
                text: 'Seu lance foi batido por ' + buyer + '.' +
                    'Acesse nosso site em leil-on.herokuapp.com'
            }
            if (buyer != undefined) {
                emailconfig.sendMail(mailOption, function (error, info) {
                    if (error) {
                        console.log('ERRO ' + error)
                        throw error
                    }
                })
            }

        }

    },
    
}


async function sendEmail(item, winner, owner){
    var mailOption1 = {
     from: ' plataformaleiloesleilon@outlook.com',
     to: owner,
     subject: 'Você vendeu o item ' + item,
     text: 'O seu item foi vendido para ' + winner + ', entre em contato para finalizar a venda.'
    }
    var mailOption2 = {
       from: 'plataformaleiloesleilon@outlook.com',
       to: winner,
       subject: 'Você venceu o leilão do item ' + item,
       text: 'O item ' + item +' foi comprado por você, o dono é ' + owner + ', entre em contato para finalizar a venda.'
    }
    emailconfig.sendMail(mailOption1, function(error, info){
       if (error) {
         res.json({sucess: false, msg: 'Email não foi enviado ', error: error})
       } else {
           emailconfig.sendMail(mailOption2, function(error, info){
               if (error) {
                   res.json({sucess: false, msg: 'Email não foi enviado ', error: error})
               } else {
                   res.json({sucess:true, msg: info.response});
               }
             });
       }
     });

}
module.exports = functions