// routes/api/guides.js
const express = require('express');
const router = express.Router();

const {
    createGuide,
    addGuideDocuments,
    getGuideById,
} = require('../models/guides');

const guide = require('../models/guides')

router.get('/', async (req, res) => {
  try {
    const users = await guide.getAllGuides();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});


// ---------------- REGISTER GUIDE ----------------
router.post('/register', async (req, res) => {
    try {
        const { guideDetails, documents } = req.body;

        if (!guideDetails || !guideDetails.national_id || !guideDetails.full_name) {
            return res.status(400).json({ 
                message: "national_id and full_name are required"
            });
        }

        const guide_id = await createGuide(guideDetails);

        if (documents && documents.length > 0) {
            await addGuideDocuments(guide_id, documents);
        }

        res.status(201).json({
            message: "Guide registered successfully",
            guide_id
        });

    } catch (err) {
        console.error("Error registering guide:", err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ 
                message: "Duplicate entry: national_id or email already exists"
            });
        }

        res.status(500).json({ 
            message: "Server error",
            error: err.message
        });
    }
});


// ---------------- GET GUIDE ----------------
router.get('/:id', async (req, res) => {
    try {
        const guide = await getGuideById(req.params.id);

        if (!guide) return res.status(404).json({ message: "Guide not found" });

        res.json(guide);

    } catch (err) {
        console.error("Error fetching guide:", err);
        res.status(500).json({ 
            message: "Server error",
            error: err.message
        });
    }
});

module.exports = router;
