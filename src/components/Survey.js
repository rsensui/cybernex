import React, { useState } from 'react';
import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, TextField, Slider } from '@mui/material';

const Survey = ({ questions, onComplete, goToNextStep, goToPreviousStep, isLastStep, goToTop }) => {
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(answers);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        アンケート
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {questions.map((question, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              {question.text}
            </Typography>
            {question.type === 'multiple-choice' && (
              <RadioGroup
                value={answers[index] || ''}
                onChange={(e) => handleAnswer(index, e.target.value)}
              >
                {question.options.map((option, idx) => (
                  <FormControlLabel key={idx} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            )}
            {question.type === 'text' && (
              <TextField
                fullWidth
                multiline
                rows={4}
                value={answers[index] || ''}
                onChange={(e) => handleAnswer(index, e.target.value)}
              />
            )}
            {question.type === 'slider' && (
              <Slider
                value={answers[index] || 50}
                onChange={(e, newValue) => handleAnswer(index, newValue)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={100}
              />
            )}
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button onClick={goToPreviousStep} variant="outlined" color="secondary">
            戻る
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isLastStep ? '完了' : '次へ'}
          </Button>
        </Box>
        <Button onClick={goToTop} variant="outlined" color="secondary" sx={{ mt: 2 }}>
          トップに戻る
        </Button>
      </Box>
    </Box>
  );
};

export default Survey;
