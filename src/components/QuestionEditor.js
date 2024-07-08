import React, { useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const QuestionEditor = ({ initialQuestions, onQuestionsCreated }) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple-choice',
    text: '',
    options: [''],
  });

  const handleTypeChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].type = event.target.value;
    setQuestions(newQuestions);
  };

  const handleTextChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { type: 'multiple-choice', text: '', options: [''] }]);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    onQuestionsCreated(questions);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>質問エディタ</Typography>
      {questions.map((question, index) => (
        <Box key={index} sx={{ mb: 2, border: '1px solid #ddd', borderRadius: '8px', p: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>質問タイプ</InputLabel>
            <Select value={question.type} onChange={(e) => handleTypeChange(index, e)}>
              <MenuItem value="multiple-choice">複数選択</MenuItem>
              <MenuItem value="text">自由回答</MenuItem>
              <MenuItem value="slider">スライダー</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="質問文"
            value={question.text}
            onChange={(e) => handleTextChange(index, e)}
            sx={{ mb: 2 }}
          />
          {question.type === 'multiple-choice' && (
            <Box>
              {question.options.map((option, optionIndex) => (
                <TextField
                  key={optionIndex}
                  fullWidth
                  label={`選択肢 ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  sx={{ mb: 1 }}
                />
              ))}
              <Button onClick={() => handleAddOption(index)}>選択肢を追加</Button>
            </Box>
          )}
          <IconButton onClick={() => handleDeleteQuestion(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button onClick={handleAddQuestion} variant="contained" sx={{ mt: 2 }}>
        質問を追加
      </Button>
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        sx={{ mt: 2, ml: 2 }}
      >
        質問を確定
      </Button>
    </Box>
  );
};

export default QuestionEditor;
