export interface LoanApplication {
  id?: string;
  applicantName: string;
  propertyAddress: string;
  creditScore: number;
  monthlyIncome: number;
  requestedAmount: number;
  loanTermMonths: number;
  eligible?: boolean;
  reason?: string;
  crimeGrade?: string;
  createdAt?: Date;
}

export interface LoanApplicationRequest {
  applicantName: string;
  propertyAddress: string;
  creditScore: number;
  monthlyIncome: number;
  requestedAmount: number;
  loanTermMonths: number;
}

export interface EligibilityResult {
  eligible: boolean;
  reason: string;
}

export interface CrimeDataResponse {
  crimeGrade: string;
}
