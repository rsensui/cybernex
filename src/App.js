import React, { useState, lazy, Suspense } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Grid, Paper, Typography, CircularProgress, Button, TextField, Link, Box } from '@mui/material';
import * as XLSX from 'xlsx';

const VideoPlayer = lazy(() => import('./components/VideoPlayer'));
const Survey = lazy(() => import('./components/Survey'));
const QuestionEditor = lazy(() => import('./components/QuestionEditor'));
const VideoEditor = lazy(() => import('./components/VideoEditor'));

export const theme = createTheme({
  palette: {
    primary: { main: '#DC143C' },
    secondary: { main: '#1E1E1E' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
});

const defaultQuestions = [
  { type: 'multiple-choice', text: '動画の内容は理解しやすかったですか？', options: ['満足', 'やや満足', 'どちらともいえない', 'やや不満', '不満'] },
  { type: 'multiple-choice', text: '動画の長さは適切でしたか？', options: ['満足', 'やや満足', 'どちらともいえない', 'やや不満', '不満'] },
  { type: 'multiple-choice', text: '動画の画質は良かったですか？', options: ['満足', 'やや満足', 'どちらともいえない', 'やや不満', '不満'] },
  { type: 'multiple-choice', text: '動画の音質は良かったですか？', options: ['満足', 'やや満足', 'どちらともいえない', 'やや不満', '不満'] },
  { type: 'multiple-choice', text: '全体的に満足できる内容でしたか？', options: ['満足', 'やや満足', 'どちらともいえない', 'やや不満', '不満'] },
];

const defaultVideos = [
  { id: 'uWUHqSvPRjA', title: '動画1: 製品紹介' },
  { id: 'FkJODF2lHuk', title: '動画2: 使用方法' },
  { id: 'b1vo26cSLtA', title: '動画3: お客様の声' }
];

const App = () => {
  const [currentStep, setCurrentStep] = useState('name');
  const [userName, setUserName] = useState('');
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [questions, setQuestions] = useState(defaultQuestions);
  const [videos, setVideos] = useState(defaultVideos);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [showVideoEditor, setShowVideoEditor] = useState(false);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setCurrentStep('introduction');
    }
  };

  const handleSurveyComplete = (answers, videoIndex) => {
    setSurveyAnswers(prev => ({ ...prev, [`video${videoIndex + 1}`]: answers }));
    if (videoIndex < videos.length - 1) {
      setCurrentStep(`video${videoIndex + 2}`);
    } else {
      setCurrentStep('completion');
    }
  };

  const handleQuestionsCreated = (newQuestions) => {
    setQuestions(newQuestions);
    setShowQuestionEditor(false);
  };

  const handleVideosCreated = (newVideos) => {
    setVideos(newVideos);
    setShowVideoEditor(false);
  };

  const downloadCSV = () => {
    const csvContent = generateCSVContent();
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // BOM for UTF-8
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `survey_results_${userName}.csv`;
    link.click();
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(generateJSONContent());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Survey Results");
    XLSX.writeFile(wb, `survey_results_${userName}.xlsx`);
  };

  const generateCSVContent = () => {
    const header = ['Time', 'Name', 'Video No.', ...questions.map(q => `<${q.text}>`)].join(',');
    const timestamp = new Date().toLocaleString();
    const rows = Object.entries(surveyAnswers).flatMap(([videoKey, answers], videoIndex) => {
      return questions.map((question, questionIndex) => {
        const answer = answers[questionIndex] || '未回答';
        return [timestamp, userName, videoIndex + 1, question.text, answer].join(',');
      });
    });
    return [header, ...rows].join('\n');
  };

  const generateJSONContent = () => {
    const timestamp = new Date().toLocaleString();
    return Object.entries(surveyAnswers).flatMap(([videoKey, answers], videoIndex) => {
      return questions.map((question, questionIndex) => {
        return {
          Time: timestamp,
          Name: userName,
          'Video No.': videoIndex + 1,
          '質問名': question.text,
          '回答': answers[questionIndex] || '未回答'
        };
      });
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'name':
        return (
          <Box component="form" onSubmit={handleNameSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" gutterBottom>お名前を入力してください</Typography>
            <TextField
              label="お名前"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" color="primary">
              開始
            </Button>
            <Link
              component="button"
              variant="body2"
              onClick={() => setShowQuestionEditor(true)}
              sx={{ mt: 2 }}
            >
              質問を編集する（管理者用）
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={() => setShowVideoEditor(true)}
              sx={{ mt: 2 }}
            >
              動画を編集する（管理者用）
            </Link>
          </Box>
        );
      case 'introduction':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>説明</Typography>
            <Typography>
              本アプリケーションはサンプルです。この後、{videos.length}つの動画が流れ、各動画の後にアンケートにお答えください。
            </Typography>
            <Button onClick={() => setCurrentStep('video1')} variant="contained" color="primary" sx={{ mt: 2 }}>
              開始
            </Button>
          </Box>
        );
      default:
        if (currentStep.startsWith('video')) {
          const videoIndex = parseInt(currentStep.replace('video', ''), 10) - 1;
          return (
            <Suspense fallback={<CircularProgress />}>
              <VideoPlayer
                videoId={videos[videoIndex].id}
                title={videos[videoIndex].title}
                onComplete={() => setCurrentStep(`survey${videoIndex + 1}`)}
                goToNextStep={() => setCurrentStep(`survey${videoIndex + 1}`)}
                goToPreviousStep={() => setCurrentStep(videoIndex > 0 ? `survey${videoIndex}` : 'introduction')}
                goToTop={() => setCurrentStep('name')}
              />
            </Suspense>
          );
        }
        if (currentStep.startsWith('survey')) {
          const surveyIndex = parseInt(currentStep.replace('survey', ''), 10) - 1;
          return (
            <Suspense fallback={<CircularProgress />}>
              <Survey
                questions={questions}
                onComplete={(answers) => handleSurveyComplete(answers, surveyIndex)}
                goToNextStep={() => setCurrentStep(surveyIndex < videos.length - 1 ? `video${surveyIndex + 2}` : 'completion')}
                goToPreviousStep={() => setCurrentStep(`video${surveyIndex + 1}`)}
                isLastStep={surveyIndex === videos.length - 1}
                goToTop={() => setCurrentStep('name')}
              />
            </Suspense>
          );
        }
        if (currentStep === 'completion') {
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" gutterBottom>ご協力ありがとうございました</Typography>
              <Typography gutterBottom>
                {userName}さん、アンケートへのご回答ありがとうございました。
              </Typography>
              <Button onClick={downloadCSV} variant="contained" color="primary">
                結果をCSVでダウンロード
              </Button>
              <Button onClick={downloadExcel} variant="contained" color="secondary">
                結果をExcelでダウンロード
              </Button>
              <Button onClick={() => setCurrentStep(`survey${videos.length}`)} variant="outlined" color="secondary">
                戻る
              </Button>
              <Button onClick={() => setCurrentStep('name')} variant="outlined" color="secondary">
                トップに戻る
              </Button>
            </Box>
          );
        }
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h4" gutterBottom align="center">
                資生堂案件実験用アプリケーション
              </Typography>
              {showQuestionEditor ? (
                <Suspense fallback={<CircularProgress />}>
                  <QuestionEditor
                    initialQuestions={questions}
                    onQuestionsCreated={handleQuestionsCreated}
                  />
                </Suspense>
              ) : showVideoEditor ? (
                <Suspense fallback={<CircularProgress />}>
                  <VideoEditor
                    initialVideos={videos}
                    onVideosCreated={handleVideosCreated}
                  />
                </Suspense>
              ) : (
                renderStep()
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
