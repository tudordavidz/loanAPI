import axios from "axios";
import { CrimeDataResponse } from "../types/loan.types";

export class CrimeGradeService {
  private readonly baseUrl = "https://www.crimeometer.com/api";

  /**
   * Fetches crime grade for a given address
   * Uses crimeometer.com API as an alternative to crimegrades.org
   */
  async getCrimeGrade(address: string): Promise<string> {
    try {
      // Simulate API call - In real implementation, you would call the actual crime API
      // For demo purposes, we'll return a mock response based on the address
      const mockGrade = this.getMockCrimeGrade(address);
      return mockGrade;
    } catch (error) {
      console.error("Error fetching crime grade:", error);
      // Default to 'C' grade if API fails
      return "C";
    }
  }

  /**
   * Mock implementation for demonstration
   * In real implementation, this would make actual API calls
   */
  private getMockCrimeGrade(address: string): string {
    // Simple mock logic based on address characteristics
    const lowerAddress = address.toLowerCase();

    if (
      lowerAddress.includes("sunnyvale") ||
      lowerAddress.includes("palo alto") ||
      lowerAddress.includes("cupertino")
    ) {
      return "A";
    } else if (
      lowerAddress.includes("oakland") ||
      lowerAddress.includes("richmond")
    ) {
      return "F";
    } else if (
      lowerAddress.includes("san francisco") ||
      lowerAddress.includes("san jose")
    ) {
      return "B";
    } else {
      return "C";
    }
  }

  /**
   * Real implementation example (commented out)
   * Uncomment and modify based on the actual crime API you choose
   */
  /*
  private async fetchFromCrimeAPI(address: string): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}/crime-data`, {
        params: {
          address: address,
          api_key: process.env.CRIME_API_KEY
        }
      });
      
      return response.data.crimeGrade || 'C';
    } catch (error) {
      throw new Error(`Failed to fetch crime data: ${error}`);
    }
  }
  */
}
