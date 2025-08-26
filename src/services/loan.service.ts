import { v4 as uuidv4 } from "uuid";
import { LoanApplication, LoanApplicationRequest } from "../types/loan.types";
import { LoanRepository } from "../repositories/loan.repository";
import { EligibilityService } from "./eligibility.service";
import { CrimeGradeService } from "./crimeGrade.service";

export class LoanService {
  constructor(
    private loanRepository: LoanRepository,
    private eligibilityService: EligibilityService,
    private crimeGradeService: CrimeGradeService
  ) {}

  /**
   * Processes a new loan application
   */
  async processLoanApplication(
    applicationData: LoanApplicationRequest
  ): Promise<LoanApplication> {
    // Validate input data
    const validationErrors =
      this.eligibilityService.validateLoanApplication(applicationData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    // Get crime grade for the property address
    const crimeGrade = await this.crimeGradeService.getCrimeGrade(
      applicationData.propertyAddress
    );

    // Evaluate eligibility
    const eligibilityResult = this.eligibilityService.evaluateEligibility(
      applicationData.creditScore,
      applicationData.monthlyIncome,
      applicationData.requestedAmount,
      applicationData.loanTermMonths,
      crimeGrade
    );

    // Create loan application object
    const loanApplication: LoanApplication = {
      id: uuidv4(),
      applicantName: applicationData.applicantName,
      propertyAddress: applicationData.propertyAddress,
      creditScore: applicationData.creditScore,
      monthlyIncome: applicationData.monthlyIncome,
      requestedAmount: applicationData.requestedAmount,
      loanTermMonths: applicationData.loanTermMonths,
      eligible: eligibilityResult.eligible,
      reason: eligibilityResult.reason,
      crimeGrade: crimeGrade,
    };

    // Save to repository
    return await this.loanRepository.save(loanApplication);
  }

  /**
   * Retrieves a loan application by ID
   */
  async getLoanApplication(id: string): Promise<LoanApplication | null> {
    if (!id) {
      throw new Error("Loan ID is required");
    }

    return await this.loanRepository.findById(id);
  }
}
