const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const questionSetRoutes = require('./routes/questionSetRoutes');
const candidateExamRoutes = require('./routes/candidateExamRoutes');
const app = express();

app.use(cors());
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

// app.use(errorMiddleware);
module.exports = app;