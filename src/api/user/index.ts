import { Router } from "express";
import { getUserController } from "./user.controller";

const router = Router();

// Define the route and associate it with the controller
router.get("/:id", getUserController);

module.exports = router;
