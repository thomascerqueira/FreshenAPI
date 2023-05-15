import express from "express";
import test_controller from "~/controllers/photoController";

const router = express.Router();

router.post(
  '/send_photo',
  test_controller.receive_photo,
)

export default router;