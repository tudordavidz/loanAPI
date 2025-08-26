import { CrimeGradeService } from "../services/crimeGrade.service";

describe("CrimeGradeService", () => {
  let crimeGradeService: CrimeGradeService;

  beforeEach(() => {
    crimeGradeService = new CrimeGradeService();
  });

  describe("getCrimeGrade", () => {
    test("should return grade A for Sunnyvale address", async () => {
      // Arrange
      const address = "558 Carlisle Way Sunnyvale CA 94087";

      // Act
      const result = await crimeGradeService.getCrimeGrade(address);

      // Assert
      expect(result).toBe("A");
    });

    test("should return grade F for Oakland address", async () => {
      // Arrange
      const address = "1234 Main St Oakland CA 94601";

      // Act
      const result = await crimeGradeService.getCrimeGrade(address);

      // Assert
      expect(result).toBe("F");
    });

    test("should return grade B for San Francisco address", async () => {
      // Arrange
      const address = "123 Market St San Francisco CA 94102";

      // Act
      const result = await crimeGradeService.getCrimeGrade(address);

      // Assert
      expect(result).toBe("B");
    });

    test("should return grade C for unknown location", async () => {
      // Arrange
      const address = "123 Unknown St Nowhere CA 12345";

      // Act
      const result = await crimeGradeService.getCrimeGrade(address);

      // Assert
      expect(result).toBe("C");
    });

    test("should handle case insensitive address matching", async () => {
      // Arrange
      const address = "558 CARLISLE WAY SUNNYVALE CA 94087";

      // Act
      const result = await crimeGradeService.getCrimeGrade(address);

      // Assert
      expect(result).toBe("A");
    });
  });
});
