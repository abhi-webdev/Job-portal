import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { uploadResume } from '../services/api';

const ResumeUpload = ({ onSuccess }) => {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (
      selectedFile.type !== 'application/pdf' &&
      !selectedFile.name.toLowerCase().endsWith('.pdf')
    ) {
      setError('Only PDF files are allowed.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleUpload = async () => {

    if (!file) {
        setError("Please select a resume first.");
        return;
    }

    try {

        setLoading(true);
        setError("");

        console.log("Selected file:", file);

        const data = await uploadResume(file);

        console.log("Upload response:", data);

        if (data?.resume) {
            onSuccess(data.resume);
        }

    } catch (error) {

        console.error("Upload error:", error);

        setError(
            error.response?.data?.message ||
            "Failed to upload resume"
        );

    } finally {
        setLoading(false);
    }
};

  const chooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Upload Your Resume</CardTitle>

        <p className="text-sm text-muted-foreground">
          Upload your PDF resume and discover matching jobs.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={chooseFile}
          className="w-full border-2 border-dashed rounded-xl p-12 hover:border-primary hover:bg-primary/5 transition-all"
        >
          <div className="text-5xl mb-4">📄</div>

          <p className="font-semibold text-lg">Choose your resume</p>

          <p className="text-sm text-muted-foreground mt-2">
            PDF format · Maximum 5MB
          </p>
        </button>

        {file && (
          <div className="flex items-center justify-between bg-muted rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📄</div>

              <div>
                <p className="font-medium">{file.name}</p>

                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-sm text-muted-foreground hover:text-destructive"
            >
              Remove
            </button>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button
          className="w-full"
          size="lg"
          disabled={!file || loading}
          onClick={handleUpload}
        >
          {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
