import Typography from "@mui/material/Typography";
import "./App.css";
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CircularProgress from "@mui/material/CircularProgress";
import Button from '@mui/material/Button';
import axios from "axios";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generateReply, setGenerateReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => { 
    //api call
    setLoading(true);
    setError("");
    try {
        const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGenerateReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError("Failed to generate reply. Please try again.");
      console.error("Error generating reply:", error);
    }finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email-Reply-Genrator
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone(optional)</InputLabel>
          <Select
            value={tone || ''}
            label={"Tone(optional)"}
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            </Select> 
        </FormControl>
         
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth>
          {loading?<CircularProgress size={24} />:"Generate Reply"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )} 

      {generateReply && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Generated Reply
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            value={generateReply || ''}
            InputProps={{
              readOnly: true,
            }}
          />
          <Button
            variant="outlined"
            onClick={() => navigator.clipboard.writeText(generateReply)}
            sx={{ mt: 2 }}>
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;
