const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const questionSetRoutes = require('./routes/questionSetRoutes');
const candidateExamRoutes = require('./routes/candidateExamRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://online-assessment-akij-resources.vercel.app',
    'https://online-assessment-akij-resources-e2.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/question-sets', questionSetRoutes);
app.use('/api/v1/candidate-exams', candidateExamRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(errorMiddleware);
module.exports = app;