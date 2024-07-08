import React, { useState } from 'react';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';

const Survey = ({ questions, onComplete, goToNextStep, goToPreviousStep, isLastStep, goToTop }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(answers);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" gutterBottom>
        アンケート
      </Typography>
      {questions.map((question, index) => (
        <FormControl component="fieldset" key={index} sx={{ mt: 2 }}>
          <FormLabel component="legend">{question.text}</FormLabel>
          <RadioGroup
            row
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}
          >
            {question.options.map((option, i) => (
              <FormControlLabel
                key={i}
                value={option}
                control={<Radio color="primary" />}
                label={option}
                sx={{ flex: '1 1 auto', textAlign: 'center' }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        <Button variant="outlined" color="secondary" onClick={goToPreviousStep}>
          戻る
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {isLastStep ? '完了' : '次へ'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={goToTop}>
          トップに戻る
        </Button>
      </Box>
    </Box>
  );
};

export default Survey;
