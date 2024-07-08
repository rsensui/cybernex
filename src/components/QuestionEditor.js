import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const QuestionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[200],
  border: `2px solid ${theme.palette.primary.main}`,
}));

const OptionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  border: `1px solid ${theme.palette.grey[300]}`,
}));

const QuestionEditor = ({ initialQuestions, onQuestionsCreated }) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionOptions, setNewQuestionOptions] = useState(['', '', '', '', '']);

  useEffect(() => {
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  const handleAddQuestion = (copyPrevious = false) => {
    const options = copyPrevious && questions.length > 0 ? questions[questions.length - 1].options : [...newQuestionOptions];
    setQuestions([...questions, { type: 'multiple-choice', text: newQuestionText, options }]);
    setNewQuestionText('');
    setNewQuestionOptions(['', '', '', '', '']);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSave = () => {
    onQuestionsCreated(questions);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[index].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push('');
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (index, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[index].options = newQuestions[index].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedQuestions = Array.from(questions);
    const [removed] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, removed);
    setQuestions(reorderedQuestions);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" gutterBottom>
        質問を編集する
      </Typography>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {questions.map((question, index) => (
                <Draggable key={index} draggableId={`question-${index}`} index={index}>
                  {(provided) => (
                    <QuestionBox ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box>
                          <DragHandleIcon />
                        </Box>
                        <TextField
                          value={question.text}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].text = e.target.value;
                            setQuestions(newQuestions);
                          }}
                          placeholder="質問内容を入力してください"
                          fullWidth
                        />
                        <IconButton onClick={() => handleRemoveQuestion(index)} color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4 }}>
                        {question.options.map((option, optionIndex) => (
                          <OptionBox key={optionIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                              value={option}
                              onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                              placeholder="選択肢を入力してください"
                              fullWidth
                            />
                            <IconButton onClick={() => handleRemoveOption(index, optionIndex)} color="secondary">
                              <DeleteIcon />
                            </IconButton>
                          </OptionBox>
                        ))}
                        <Button onClick={() => handleAddOption(index)} variant="contained" color="primary" sx={{ alignSelf: 'flex-start' }}>
                          選択肢を追加
                        </Button>
                      </Box>
                    </QuestionBox>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <TextField
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          label="新しい質問"
          placeholder="質問内容を入力してください"
          fullWidth
        />
        {newQuestionOptions.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              value={option}
              onChange={(e) => {
                const newOptions = [...newQuestionOptions];
                newOptions[index] = e.target.value;
                setNewQuestionOptions(newOptions);
              }}
              label={`選択肢 ${index + 1}`}
              placeholder="選択肢を入力してください"
              fullWidth
            />
            <IconButton onClick={() => setNewQuestionOptions(newQuestionOptions.filter((_, i) => i !== index))} color="secondary">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button onClick={() => setNewQuestionOptions([...newQuestionOptions, ''])} variant="contained" color="primary">
          選択肢を追加
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={() => handleAddQuestion()} variant="contained" color="primary">
            質問を追加
          </Button>
          <Button onClick={() => handleAddQuestion(true)} variant="contained" color="secondary">
            前の選択肢をコピーして追加
          </Button>
        </Box>
      </Box>
      <Button onClick={handleSave} variant="contained" color="secondary" sx={{ alignSelf: 'flex-start', mt: 4 }}>
        保存
      </Button>
    </Box>
  );
};

export default QuestionEditor;
