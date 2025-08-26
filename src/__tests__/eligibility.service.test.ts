import { EligibilityService } from "../services/eligibility.service";

describe("EligibilityService", () => {
  let eligibilityService: EligibilityService;

  beforeEach(() => {
    eligibilityService = new EligibilityService();
  });

  describe("evaluateEligibility", () => {
    test("should approve loan when all criteria are met", () => {
      // Arrange
      const creditScore = 750;
      const monthlyIncome = 8000;
      const requestedAmount = 120000;
      const loanTermMonths = 24;
      const crimeGrade = "A";

      // Act
      const result = eligibilityService.evaluateEligibility(
        creditScore,
        monthlyIncome,
        requestedAmount,
        loanTermMonths,
        crimeGrade
      );

      // Assert
      expect(result.eligible).toBe(true);
      expect(result.reason).toBe("Passed all checks");
    });

    test("should reject loan when credit score is too low", () => {
      // Arrange
      const creditScore = 650; // Below 700
      const monthlyIncome = 8000;
      const requestedAmount = 120000;
      const loanTermMonths = 24;
      const crimeGrade = "A";

      // Act
      const result = eligibilityService.evaluateEligibility(
        creditScore,
        monthlyIncome,
        requestedAmount,
        loanTermMonths,
        crimeGrade
      );

      // Assert
      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("Credit score too low");
    });

    test("should reject loan when monthly income is insufficient", () => {
      // Arrange
      const creditScore = 750;
      const monthlyIncome = 5000; // Too low for the loan amount
      const requestedAmount = 150000;
      const loanTermMonths = 24;
      const crimeGrade = "A";

      // Monthly payment would be 150000/24 = 6250
      // Required income would be 6250 * 1.5 = 9375
      // Monthly income of 5000 is less than 9375

      // Act
      const result = eligibilityService.evaluateEligibility(
        creditScore,
        monthlyIncome,
        requestedAmount,
        loanTermMonths,
        crimeGrade
      );

      // Assert
      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("Monthly income too low");
    });

    test("should reject loan when crime grade is F", () => {
      // Arrange
      const creditScore = 750;
      const monthlyIncome = 8000;
      const requestedAmount = 120000;
      const loanTermMonths = 24;
      const crimeGrade = "F"; // Unacceptable crime grade

      // Act
      const result = eligibilityService.evaluateEligibility(
        creditScore,
        monthlyIncome,
        requestedAmount,
        loanTermMonths,
        crimeGrade
      );

      // Assert
      expect(result.eligible).toBe(false);
      expect(result.reason).toContain(
        "Property location has unacceptable crime grade"
      );
    });

    test("should reject loan when multiple criteria fail", () => {
      // Arrange
      const creditScore = 650; // Too low
      const monthlyIncome = 3000; // Too low
      const requestedAmount = 150000;
      const loanTermMonths = 24;
      const crimeGrade = "F"; // Unacceptable

      // Act
      const result = eligibilityService.evaluateEligibility(
        creditScore,
        monthlyIncome,
        requestedAmount,
        loanTermMonths,
        crimeGrade
      );

      // Assert
      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("Credit score too low");
      expect(result.reason).toContain("Monthly income too low");
      expect(result.reason).toContain(
        "Property location has unacceptable crime grade"
      );
    });

    test("should handle edge case where monthly income equals required income", () => {
      // Arrange
      const creditScore = 750;
      const requestedAmount = 120000;
      const loanTermMonths = 24;
      const monthlyPayment = requestedAmount / loanTermMonths; // 5000
      const monthlyIncome = monthlyPayment * 1.5; // Exactly 7500
      const crimeGrade = "A";

      // Act
      const result = eligibilityService.evaluateEligibility(
        creditScore,
        monthlyIncome,
        requestedAmount,
        loanTermMonths,
        crimeGrade
      );

      // Assert
      expect(result.eligible).toBe(false); // Should be false because income must be > required income, not >=
      expect(result.reason).toContain("Monthly income too low");
    });
  });

  describe("validateLoanApplication", () => {
    test("should return no errors for valid application data", () => {
      // Arrange
      const validData = {
        applicantName: "John Doe",
        propertyAddress: "123 Main St, Anytown, CA 12345",
        creditScore: 750,
        monthlyIncome: 8000,
        requestedAmount: 120000,
        loanTermMonths: 24,
      };

      // Act
      const errors = eligibilityService.validateLoanApplication(validData);

      // Assert
      expect(errors).toHaveLength(0);
    });

    test("should return errors for missing required fields", () => {
      // Arrange
      const invalidData = {};

      // Act
      const errors = eligibilityService.validateLoanApplication(invalidData);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) => error.includes("Applicant name is required"))
      ).toBe(true);
      expect(
        errors.some((error) => error.includes("Property address is required"))
      ).toBe(true);
      expect(
        errors.some((error) => error.includes("Credit score is required"))
      ).toBe(true);
      expect(
        errors.some((error) => error.includes("Monthly income is required"))
      ).toBe(true);
      expect(
        errors.some((error) => error.includes("Requested amount is required"))
      ).toBe(true);
      expect(
        errors.some((error) => error.includes("Loan term months is required"))
      ).toBe(true);
    });

    test("should return errors for invalid data types and ranges", () => {
      // Arrange
      const invalidData = {
        applicantName: 123, // Should be string
        propertyAddress: null, // Should be string
        creditScore: 1000, // Should be <= 850
        monthlyIncome: -5000, // Should be positive
        requestedAmount: 0, // Should be positive
        loanTermMonths: -12, // Should be positive
      };

      // Act
      const errors = eligibilityService.validateLoanApplication(invalidData);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some(
          (error) =>
            error.includes("Applicant name") && error.includes("string")
        )
      ).toBe(true);
      expect(
        errors.some(
          (error) =>
            error.includes("Property address") && error.includes("string")
        )
      ).toBe(true);
      expect(
        errors.some(
          (error) =>
            error.includes("Credit score") &&
            error.includes("between 300 and 850")
        )
      ).toBe(true);
      expect(
        errors.some(
          (error) =>
            error.includes("Monthly income") && error.includes("positive")
        )
      ).toBe(true);
      expect(
        errors.some(
          (error) =>
            error.includes("Requested amount") && error.includes("positive")
        )
      ).toBe(true);
      expect(
        errors.some(
          (error) =>
            error.includes("Loan term months") && error.includes("positive")
        )
      ).toBe(true);
    });
  });
});
