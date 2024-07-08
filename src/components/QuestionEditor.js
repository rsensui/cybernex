// src/components/QuestionEditor.js

import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const QuestionEditor = ({ initialQuestions, onQuestionsCreated }) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [newQuestion, setNewQuestion] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(''); // ここを削除するか使用する

  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion('');
  };

  const handleSaveQuestions = () => {
    onQuestionsCreated(questions);
  };

  return (
    <Box>
      <Typography variant="h5">質問を編集する</Typography>
      <Box>
        <TextField
          label="新しい質問"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          fullWidth
        />
        <Button onClick={handleAddQuestion} variant="contained" color="primary">
          追加
        </Button>
      </Box>
      <Box>
        {questions.map((question, index) => (
          <Typography key={index}>{question}</Typography>
        ))}
      </Box>
      <Button onClick={handleSaveQuestions} variant="contained" color="secondary">
        保存
      </Button>
    </Box>
  );
};

export default QuestionEditor;
