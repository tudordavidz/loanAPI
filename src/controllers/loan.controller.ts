import { Request, Response } from "express";
import { LoanService } from "../services/loan.service";
import { LoanApplicationRequest } from "../types/loan.types";

export class LoanController {
  constructor(private loanService: LoanService) {}

  /**
   * POST /loan - Submit a loan application
   */
  async submitLoanApplication(req: Request, res: Response): Promise<void> {
    try {
      const applicationData: LoanApplicationRequest = req.body;

      const result = await this.loanService.processLoanApplication(
        applicationData
      );

      res.status(201).json(result);
    } catch (error) {
      console.error("Error processing loan application:", error);

      if (
        error instanceof Error &&
        error.message.includes("Validation failed")
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  /**
   * GET /loan/:id - Retrieve a loan application
   */
  async getLoanApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const loanApplication = await this.loanService.getLoanApplication(id);

      if (!loanApplication) {
        res.status(404).json({ error: "Loan application not found" });
        return;
      }

      res.status(200).json(loanApplication);
    } catch (error) {
      console.error("Error retrieving loan application:", error);

      if (error instanceof Error && error.message.includes("required")) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
