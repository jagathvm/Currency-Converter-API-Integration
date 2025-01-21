import { Router } from "express";
import { getRates } from "../controllers/rates-controller.js";

const router = Router();

router.get("/rates", getRates);

export default router;
