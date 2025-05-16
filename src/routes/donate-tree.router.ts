import { Router } from "express";
import donationController from "../controllers/donate.controller"; // không đổi tên

const router = Router();

router.post("/", donationController.createDonation.bind(donationController));
router.get("/", donationController.getDonations.bind(donationController));
router.get("/infor", donationController.getInfoDonations.bind(donationController));

export default router;
