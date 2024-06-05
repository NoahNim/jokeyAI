const { OpenAI } = require("openai");
const express = require("express");
const asyncHandler = require("express-async-handler");
// const { BadIdea } = require("../../db/models");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.post('/chatgpt', asyncHandler(async (req, res) => {
    const badidea = await openai.chat.completions.create({
        messages: [{
            role: "user",
            content: "Tell me a joke."
        }],
        model: "gpt-4o",
    })
    return res.json(badidea?.choices[0]?.message?.content);
}))

// router.post('/stored-ideas', asyncHandler(async (req, res) => {
//     const idea = req.body.idea.data;
//     const userId = req.body.userId

//     const newIdea = await BadIdea.build({
//         userId,
//         idea
//     })

//     await newIdea.save();

//     return res.json(newIdea)
// }))

// router.get('/stored-ideas', requireAuth, asyncHandler(async (req, res) => {
//     console.log(req.body)

//     const badideas = await BadIdea.findAll({
//         where: {
//             userId: req.user.id
//         }
//     });

//     return res.json(badideas)
// }))

module.exports = router;