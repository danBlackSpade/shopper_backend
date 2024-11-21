"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /ride/estimate
// router.post('/estimate', estimateRide);
router.get('/test', (req, res) => {
    res.json({ message: 'Hello, World!' });
});
exports.default = router;
