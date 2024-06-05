const { OpenAI } = require("openai");
const express = require("express");
const asyncHandler = require("express-async-handler");
const { Joke } = require("../../db/models");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.post('/chatgpt', asyncHandler(async (req, res) => {
    const joke = await openai.chat.completions.create({
        messages: [{
            role: "user",
            content: "Tell me a joke."
        }],
        model: "gpt-4o",
    })
    return res.json(joke?.choices[0]?.message?.content);
}))

router.post('/stored-jokes', asyncHandler(async (req, res) => {
    const joke = req.body.joke.data;
    const userId = req.body.userId

    const newJoke = await Joke.build({
        userId,
        joke
    })

    await newJoke.save();

    return res.json(newJoke)
}))

router.get('/stored-jokes', requireAuth, asyncHandler(async (req, res) => {
    console.log(req.body)

    const jokes = await Joke.findAll({
        where: {
            userId: req.user.id
        }
    });

    return res.json(jokes)
}))

module.exports = router;