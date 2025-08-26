import { LoanService } from "../services/loan.service";
import { LoanRepository } from "../repositories/loan.repository";
import { EligibilityService } from "../services/eligibility.service";
import { CrimeGradeService } from "../services/crimeGrade.service";
import { LoanApplicationRequest } from "../types/loan.types";

describe("LoanService", () => {
  let loanService: LoanService;
  let loanRepository: LoanRepository;
  let eligibilityService: EligibilityService;
  let crimeGradeService: CrimeGradeService;

  beforeEach(() => {
    loanRepository = new LoanRepository();
    eligibilityService = new EligibilityService();
    crimeGradeService = new CrimeGradeService();
    loanService = new LoanService(
      loanRepository,
      eligibilityService,
      crimeGradeService
    );
  });

  afterEach(async () => {
    await loanRepository.clear();
  });

  describe("processLoanApplication", () => {
    test("should process valid loan application successfully", async () => {
      // Arrange
      const applicationData: LoanApplicationRequest = {
        applicantName: "John Doe",
        propertyAddress: "558 Carlisle Way Sunnyvale CA 94087",
        creditScore: 750,
        monthlyIncome: 8000,
        requestedAmount: 120000,
        loanTermMonths: 24,
      };

      // Act
      const result = await loanService.processLoanApplication(applicationData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.applicantName).toBe(applicationData.applicantName);
      expect(result.propertyAddress).toBe(applicationData.propertyAddress);
      expect(result.creditScore).toBe(applicationData.creditScore);
      expect(result.monthlyIncome).toBe(applicationData.monthlyIncome);
      expect(result.requestedAmount).toBe(applicationData.requestedAmount);
      expect(result.loanTermMonths).toBe(applicationData.loanTermMonths);
      expect(result.eligible).toBe(true);
      expect(result.reason).toBe("Passed all checks");
      expect(result.crimeGrade).toBe("A"); // Sunnyvale should get grade A
      expect(result.createdAt).toBeDefined();
    });

    test("should reject loan application with low credit score", async () => {
      // Arrange
      const applicationData: LoanApplicationRequest = {
        applicantName: "Jane Doe",
        propertyAddress: "558 Carlisle Way Sunnyvale CA 94087",
        creditScore: 650, // Below 700
        monthlyIncome: 8000,
        requestedAmount: 120000,
        loanTermMonths: 24,
      };

      // Act
      const result = await loanService.processLoanApplication(applicationData);

      // Assert
      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("Credit score too low");
    });

    test("should reject loan application in high crime area", async () => {
      // Arrange
      const applicationData: LoanApplicationRequest = {
        applicantName: "Bob Smith",
        propertyAddress: "1234 Main St Oakland CA 94601", // Oakland gets grade F
        creditScore: 750,
        monthlyIncome: 8000,
        requestedAmount: 120000,
        loanTermMonths: 24,
      };

      // Act
      const result = await loanService.processLoanApplication(applicationData);

      // Assert
      expect(result.eligible).toBe(false);
      expect(result.reason).toContain(
        "Property location has unacceptable crime grade"
      );
      expect(result.crimeGrade).toBe("F");
    });

    test("should throw error for invalid application data", async () => {
      // Arrange
      const invalidData = {
        applicantName: "", // Invalid
        propertyAddress: "558 Carlisle Way Sunnyvale CA 94087",
        creditScore: 750,
        monthlyIncome: 8000,
        requestedAmount: 120000,
        loanTermMonths: 24,
      } as LoanApplicationRequest;

      // Act & Assert
      await expect(
        loanService.processLoanApplication(invalidData)
      ).rejects.toThrow("Validation failed");
    });
  });

  describe("getLoanApplication", () => {
    test("should retrieve existing loan application", async () => {
      // Arrange
      const applicationData: LoanApplicationRequest = {
        applicantName: "Test User",
        propertyAddress: "558 Carlisle Way Sunnyvale CA 94087",
        creditScore: 750,
        monthlyIncome: 8000,
        requestedAmount: 120000,
        loanTermMonths: 24,
      };

      const savedLoan = await loanService.processLoanApplication(
        applicationData
      );

      // Act
      const retrievedLoan = await loanService.getLoanApplication(savedLoan.id!);

      // Assert
      expect(retrievedLoan).toBeDefined();
      expect(retrievedLoan!.id).toBe(savedLoan.id);
      expect(retrievedLoan!.applicantName).toBe(applicationData.applicantName);
    });

    test("should return null for non-existent loan application", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act
      const result = await loanService.getLoanApplication(nonExistentId);

      // Assert
      expect(result).toBeNull();
    });

    test("should throw error for empty loan ID", async () => {
      // Act & Assert
      await expect(loanService.getLoanApplication("")).rejects.toThrow(
        "Loan ID is required"
      );
    });
  });
});
