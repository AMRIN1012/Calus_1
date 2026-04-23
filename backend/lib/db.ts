import Database from 'better-sqlite3';
import path from 'path';

// Database file path
const dbPath = path.join(process.cwd(), 'calus.db');

// Initialize database
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    score INTEGER NOT NULL,
    riskLevel TEXT NOT NULL,
    factors TEXT NOT NULL, -- JSON string
    aiAnalysis TEXT,
    transactionAmount REAL NOT NULL,
    transactionLocation TEXT NOT NULL,
    transactionDevice TEXT NOT NULL,
    timestamp TEXT NOT NULL
  )
`);

export interface DatabaseAssessment {
  id: string;
  score: number;
  riskLevel: string;
  factors: string;
  aiAnalysis: string;
  transactionAmount: number;
  transactionLocation: string;
  transactionDevice: string;
  timestamp: string;
}

export const dbService = {
  saveAssessment: (assessment: any, transaction: any) => {
    const stmt = db.prepare(`
      INSERT INTO assessments (id, score, riskLevel, factors, aiAnalysis, transactionAmount, transactionLocation, transactionDevice, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      crypto.randomUUID(),
      assessment.score,
      assessment.riskLevel,
      JSON.stringify(assessment.factors),
      assessment.aiAnalysis || null,
      transaction.amount,
      transaction.currentLocation,
      transaction.deviceType,
      assessment.timestamp
    );
  },

  getHistory: (limit = 50) => {
    const stmt = db.prepare('SELECT * FROM assessments ORDER BY timestamp DESC LIMIT ?');
    return stmt.all(limit) as DatabaseAssessment[];
  }
};

export default db;
