import express from "express";
import dotenv from "dotenv";
import { LoanRepository } from "./repositories/loan.repository";
import { LoanService } from "./services/loan.service";
import { EligibilityService } from "./services/eligibility.service";
import { CrimeGradeService } from "./services/crimeGrade.service";
import { LoanController } from "./controllers/loan.controller";
import { createLoanRoutes } from "./routes/loan.routes";

// Load environment variables
dotenv.config();

class App {
  public app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "3000", 10);

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // CORS and basic security headers
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-api-key"
      );
      next();
    });
  }

  private initializeRoutes(): void {
    // Initialize dependencies
    const loanRepository = new LoanRepository();
    const eligibilityService = new EligibilityService();
    const crimeGradeService = new CrimeGradeService();
    const loanService = new LoanService(
      loanRepository,
      eligibilityService,
      crimeGradeService
    );
    const loanController = new LoanController(loanService);

    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res
        .status(200)
        .json({ status: "OK", timestamp: new Date().toISOString() });
    });

    // Loan routes
    this.app.use("/loan", createLoanRoutes(loanController));

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({ error: "Route not found" });
    });

    // Error handler
    this.app.use(
      (
        error: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.error("Unhandled error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    );
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Loan Eligibility API is running on port ${this.port}`);
      console.log(
        `📊 Health check available at http://localhost:${this.port}/health`
      );
    });
  }
}

// Start the server
const app = new App();
app.listen();

export default app;
