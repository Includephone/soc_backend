const express = require('express');
const router = express.Router();

const Friend = require('../../models/Friend');

router.post('/status', (req, res)=>{
    Friend.findOne({
        $or:[
            {
                'user1': req.body.user1,
                'user2': req.body.user2
            },
            {
                'user1': req.body.user2,
                'user2': req.body.user1
            }
        ]
    }).then((friend)=>{
        if(friend){
            res.json({
                status: friend.status,
                from: friend.user1
            })
        } else{
            res.json({status: 'notFriends'})
        }
    }).catch((err)=>{
        res.status(400).json({
            err:'some error'
        })
    })
});

router.post('/add', (req, res)=>{
    console.log(req.body);
    Friend.findOne({
        $or:[
            {
                'user1': req.body.user1,
                'user2': req.body.user2
            },
            {
                'user1': req.body.user2,
                'user2': req.body.user1
            }
        ]
    }).then((friend)=>{
        if(friend){
            res.status(400).json({
                message:'Already exists'
            })
        } else{
            const newFriend = new Friend({
                user1: req.body.user1,
                user2: req.body.user2
            });
            newFriend.save();
            res.json({
                from: newFriend.user1,
                status: newFriend.status
            });
        }
    }).catch((err)=>{
        res.status(400).json({err});
    });
});

router.put('/edit', (req, res)=>{
    if(req.body.action){
        Friend.findOneAndUpdate({
            $or:[
                {
                    'user1': req.body.user1,
                    'user2': req.body.user2
                },
                {
                    'user1': req.body.user2,
                    'user2': req.body.user1
                }]
        }, {status: true}).then((friend)=>{
            res.json({
                status: true,
                from: friend.user1
            })
        }).catch((err)=>{
            res.status(400).json({
                err
            })
        });
    } else {
        Friend.findOneAndDelete({
            $or:[
                {
                    'user1': req.body.user1,
                    'user2': req.body.user2
                },
                {
                    'user1': req.body.user2,
                    'user2': req.body.user1
                }]
        }).then((friend)=>{
            res.json({
                status: null,
                from: ""
            })
        }).catch((err)=>{
            res.status(400).json({
                err
            })
        });
    }
})

module.exports = router;