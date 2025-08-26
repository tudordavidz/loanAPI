import express from "express";
import { LoanController } from "../controllers/loan.controller";
import { authenticateApiKey } from "../middleware/auth.middleware";

export function createLoanRoutes(
  loanController: LoanController
): express.Router {
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authenticateApiKey);

  // POST /loan - Submit loan application
  router.post("/", async (req, res) => {
    await loanController.submitLoanApplication(req, res);
  });

  // GET /loan/:id - Get loan application by ID
  router.get("/:id", async (req, res) => {
    await loanController.getLoanApplication(req, res);
  });

  return router;
}
