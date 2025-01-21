import { Router } from "express";
import {
  convertCurrency,
  convertCurrencyV2,
} from "../controllers/convert-controller.js";

const router = Router();

router.post("/convert", convertCurrency);
router.post("/convert/v2", convertCurrencyV2);

export default router;
