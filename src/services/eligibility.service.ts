import { LoanApplication, EligibilityResult } from "../types/loan.types";

export class EligibilityService {
  /**
   * Evaluates loan eligibility based on business rules
   */
  evaluateEligibility(
    creditScore: number,
    monthlyIncome: number,
    requestedAmount: number,
    loanTermMonths: number,
    crimeGrade: string
  ): EligibilityResult {
    const reasons: string[] = [];

    // Rule 1: Credit score must be >= 700
    if (creditScore < 700) {
      reasons.push("Credit score too low");
    }

    // Rule 2: Monthly income must be > (requestedAmount / loanTermMonths) * 1.5
    const monthlyPayment = requestedAmount / loanTermMonths;
    const requiredIncome = monthlyPayment * 1.5;

    if (monthlyIncome <= requiredIncome) {
      reasons.push("Monthly income too low");
    }

    // Rule 3: Crime grade must not be 'F'
    if (crimeGrade === "F") {
      reasons.push("Property location has unacceptable crime grade");
    }

    const eligible = reasons.length === 0;
    const reason = eligible ? "Passed all checks" : reasons.join(", ");

    return {
      eligible,
      reason,
    };
  }

  /**
   * Validates loan application data
   */
  validateLoanApplication(data: any): string[] {
    const errors: string[] = [];

    if (!data.applicantName || typeof data.applicantName !== "string") {
      errors.push("Applicant name is required and must be a string");
    }

    if (!data.propertyAddress || typeof data.propertyAddress !== "string") {
      errors.push("Property address is required and must be a string");
    }

    if (
      !data.creditScore ||
      typeof data.creditScore !== "number" ||
      data.creditScore < 300 ||
      data.creditScore > 850
    ) {
      errors.push(
        "Credit score is required and must be a number between 300 and 850"
      );
    }

    if (
      !data.monthlyIncome ||
      typeof data.monthlyIncome !== "number" ||
      data.monthlyIncome <= 0
    ) {
      errors.push("Monthly income is required and must be a positive number");
    }

    if (
      !data.requestedAmount ||
      typeof data.requestedAmount !== "number" ||
      data.requestedAmount <= 0
    ) {
      errors.push("Requested amount is required and must be a positive number");
    }

    if (
      !data.loanTermMonths ||
      typeof data.loanTermMonths !== "number" ||
      data.loanTermMonths <= 0
    ) {
      errors.push("Loan term months is required and must be a positive number");
    }

    return errors;
  }
}
