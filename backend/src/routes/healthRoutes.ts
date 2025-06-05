import express, { Router, Request, Response } from 'express';
import { HealthController } from '../controllers/healthController';

const router: Router = express.Router();
const healthController = new HealthController();

// GET /health - Check API health status
router.get('/', (req: Request, res: Response) => {
  return healthController.getHealth(req, res);
});

export default router;
