const express = require('express');
const router = express.Router();

const Message = require('../../models/Message');
const Conservation = require('../../models/Conservation');
const { distinct } = require('../../models/Message');

router.post('/newmessage', (req, res)=>{
    Conservation.findOne({
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
    }).then((conserv)=>{
        if(conserv){
            const newMessage = new Message({
                message: req.body.text,
                conservation: conserv._id,
                sender: req.body.user1
            });
            newMessage.save();
            res.json({
                result: newMessage
            })
        } else {
            const newConservation = new Conservation({
                user1: req.body.user1,
                user2: req.body.user2
            });
            newConservation.save()
            .then((newconserv)=>{
                const newMessage = new Message({
                    message: req.body.text,
                    conservation: newconserv._id,
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

    Conservation.find({
        $or:[
            {user1: req.body.user},
            {user2: req.body.user}
        ]
    })
    .sort({updateAt: -1})
    .limit(10)
    .then((conserv)=>{
        let idArray = []
        conserv.map((item)=>{
            idArray.push(item._id);
        });
        Message.aggregate([
            {$match: {
                'conservation' : {$in: idArray}}
            },
            {$group:{
                _id: '$conservation',
                'read': {'$last': '$read'},
                'message': {'$last': '$message'},
                'conservation': {'$last': '$conservation'},
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
                    from: 'conservations',
                    localField: 'conservation',
                    foreignField: '_id',
                    as: 'conservation'
                }
            },
            {$unwind: '$conservation'},
            {$lookup:{
                    from: 'users',
                    localField: 'conservation.user1',
                    foreignField: '_id',
                    as: 'conservation.user1'
                }
            },
            {$lookup:{
                    from: 'users',
                    localField: 'conservation.user2',
                    foreignField: '_id',
                    as: 'conservation.user2'
                }
            },
            {$unwind: '$conservation.user1'},
            {$unwind: '$conservation.user2'},
            {$unwind: '$sender'},
            {$project: {
                'conservation.createdAt': 0,
                'conservation.updatedAt': 0,
                'conservation.__v': 0,
                'sender.email': 0,
                'sender.password': 0,
                'sender.date': 0,
                'sender.date': 0,
                'sender.__v': 0,
                'conservation.user1.email': 0,
                'conservation.user1.password': 0,
                'conservation.user1.date': 0,
                'conservation.user1.__v': 0,
                'conservation.user2.email': 0,
                'conservation.user2.password': 0,
                'conservation.user2.date': 0,
                'conservation.user2.__v': 0,
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