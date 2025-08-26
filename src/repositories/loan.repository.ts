import { LoanApplication } from "../types/loan.types";

export class LoanRepository {
  private loans: Map<string, LoanApplication> = new Map();

  /**
   * Saves a loan application
   */
  async save(loan: LoanApplication): Promise<LoanApplication> {
    if (!loan.id) {
      throw new Error("Loan ID is required");
    }

    this.loans.set(loan.id, { ...loan, createdAt: new Date() });
    return this.loans.get(loan.id)!;
  }

  /**
   * Finds a loan application by ID
   */
  async findById(id: string): Promise<LoanApplication | null> {
    const loan = this.loans.get(id);
    return loan || null;
  }

  /**
   * Gets all loan applications (for testing purposes)
   */
  async findAll(): Promise<LoanApplication[]> {
    return Array.from(this.loans.values());
  }

  /**
   * Deletes a loan application (for testing purposes)
   */
  async delete(id: string): Promise<boolean> {
    return this.loans.delete(id);
  }

  /**
   * Clears all loans (for testing purposes)
   */
  async clear(): Promise<void> {
    this.loans.clear();
  }
}
