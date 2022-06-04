const express = require('express')
const Task = require('../models/task')
const auth = require('../middlewares/auth')
const router = new express.Router()


router.post('/tasks',auth , async (req , res) => {
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try{
        const tasks = await task.save()
        res.status(201).send(tasks) 
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', auth, async (req, res)=> {
    try{
        // const tasks = await Task.find({ owner : req.user._id }).populate('owner') 
        const match = {}
        const sort = {}

        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        await req.user.populate({
            path : 'tasks',
            match ,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort 
            }
        })
        res.status(200).send(req.user.tasks)
    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const tasks = await Task.findOne({ _id, owner : req.user._id })
        if(!tasks){
            res.status(404).send()
        }
        res.status(200).send(tasks)
    } catch(e) {
        res.status(500).send(e)
    }   
})

router.patch('/tasks/:id', auth ,async (req , res)=> {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['decription','completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send({error : 'Invalid updates'})
    }
    try{
        const tasks = await Task.findOne({ _id : req.params.id , owner : req.user._id })
        if(!tasks){
           return  res.status(404).send()
        }

        updates.forEach((update) => tasks[update] = req.body[update])
        await tasks.save()
        res.status(200).send(tasks)
    }catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth ,async (req , res)=> {
    try{
         
        const tasks = await Task.findOneAndDelete({ _id : req.params.id, owner : req.user._id })
        if(!tasks){
            res.status(404).send()
        }
        res.status(200).send(tasks)
    }catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
 })

 module.exports = router

