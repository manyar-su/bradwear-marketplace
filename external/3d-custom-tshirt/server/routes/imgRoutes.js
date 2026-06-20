import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
    res.status(200).json({ message: "Hello from AI Image generation routes" })
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        const form = new FormData()
        form.append('prompt', prompt)

        fetch('https://clipdrop-api.co/text-to-image/v1', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.API_KEY,
            },
            body: form,
        })
            .then(response => response.arrayBuffer())
            .then(img => {
                const base64Image = Buffer.from(img).toString('base64');
                res.status(200).json({ photo: base64Image });
            })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" })
    }
})

export default router;