const express = require('express');
const router = express.Router();

const Message = require('../../models/Message');
const Dialog = require('../../models/Dialog');
const { distinct } = require('../../models/Message');

router.post('/newmessage', (req, res)=>{
    Dialog.findOne({
        $or: [
            {
                user1: req.body.user1,
                user2: req.body.user2
            },
            {
                user1: req.body.user2,
                user2: req.body.user1
            }
        ]
    }).then((dialog)=>{
        if(dialog){
            const newMessage = new Message({
                message: req.body.text,
                dialog: dialog._id,
                sender: req.body.user1
            });
            newMessage.save();
            res.json({
                result: newMessage
            })
        } else {
            const newDialog = new Dialog({
                user1: req.body.user1,
                user2: req.body.user2
            });
            newDialog.save()
            .then((newdialog)=>{
                const newMessage = new Message({
                    message: req.body.text,
                    dialog: newdialog._id,
                    sender: req.body.user1
                });
                newMessage.save();
                res.json({
                    result: newMessage
                })
            })
            .catch((err)=>console.log(err))
        }
    })
    .catch((err)=>console.log(err))
});

router.post('/list', (req, res)=>{

    Dialog.find({
        $or:[
            {user1: req.body.user},
            {user2: req.body.user}
        ]
    })
    .sort({updateAt: -1})
    .limit(10)
    .then((dialog)=>{
        let idArray = []
        dialog.map((item)=>{
            idArray.push(item._id);
        });
        Message.aggregate([
            {$match: {
                'dialog' : {$in: idArray}}
            },
            {$group:{
                _id: '$dialog',
                'read': {'$last': '$read'},
                'message': {'$last': '$message'},
                'dialog': {'$last': '$dialog'},
                'sender' : {'$last': '$sender'},
                'createdAt': {'$last': '$createdAt'},
                'messageId': {'$last': '$_id'}
            }},
            {$lookup:{
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'sender'
                }
            },
            {$lookup:{
                    from: 'dialogs',
                    localField: 'dialog',
                    foreignField: '_id',
                    as: 'dialog'
                }
            },
            {$unwind: '$dialog'},
            {$lookup:{
                    from: 'users',
                    localField: 'dialog.user1',
                    foreignField: '_id',
                    as: 'dialog.user1'
                }
            },
            {$lookup:{
                    from: 'users',
                    localField: 'dialog.user2',
                    foreignField: '_id',
                    as: 'dialog.user2'
                }
            },
            {$unwind: '$dialog.user1'},
            {$unwind: '$dialog.user2'},
            {$unwind: '$sender'},
            {$project: {
                'dialog.createdAt': 0,
                'dialog.updatedAt': 0,
                'dialog.__v': 0,
                'sender.email': 0,
                'sender.password': 0,
                'sender.date': 0,
                'sender.date': 0,
                'sender.__v': 0,
                'dialog.user1.email': 0,
                'dialog.user1.password': 0,
                'dialog.user1.date': 0,
                'dialog.user1.__v': 0,
                'dialog.user2.email': 0,
                'dialog.user2.password': 0,
                'dialog.user2.date': 0,
                'dialog.user2.__v': 0,
            }}
        ])
        .then((messages)=>{
            res.json({
                messages
            })
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
})

module.exports = router;