import { Router } from "express";
import { getContactController, markSpamController } from "./contact.controller";

const router = Router();

// Define the route and associate it with the controller
router.get("/", getContactController);
router.post('/spam-report', markSpamController);

module.exports = router;
