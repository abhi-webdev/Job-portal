import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { uploadResume } from '../services/api';
import { UploadCloud, FileCode, CheckCircle2, AlertCircle, Sparkles, Terminal } from 'lucide-react';

const ResumeUpload = ({ onSuccess }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (
      selectedFile.type !== 'application/pdf' &&
      !selectedFile.name.toLowerCase().endsWith('.pdf')
    ) {
      setError('Only PDF resumes are supported.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF resume file.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await uploadResume(file);
      onSuccess(data.resume);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to parse resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md border-border bg-card">
      <CardHeader className="text-center pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20 mx-auto mb-1">
          <Terminal className="w-3.5 h-3.5" />
          <span>resume_parser.wasm</span>
        </div>
        <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
          Upload Your Developer Resume
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Our keyword matching engine extracts your tech stack and ranks opening positions instantly.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-primary bg-primary/10 scale-[0.99]'
              : 'border-border hover:border-primary/60 hover:bg-muted/40'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-muted text-foreground flex items-center justify-center mx-auto mb-3 border border-border group-hover:border-primary">
            <UploadCloud className="w-6 h-6 text-primary" />
          </div>

          <p className="font-semibold text-sm text-foreground">
            Drop your PDF here, or <span className="text-primary underline">browse files</span>
          </p>

          <p className="text-xs text-muted-foreground font-mono mt-1">
            Max 5MB · Standard PDF format
          </p>
        </div>

        {/* File Preview */}
        {file && (
          <div className="flex items-center justify-between bg-muted/60 border border-border rounded-xl p-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs shrink-0">
                <FileCode className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-xs text-foreground truncate">{file.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="text-xs text-muted-foreground hover:text-destructive px-2 py-1 transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          className="w-full h-11 text-sm font-semibold bg-primary hover:bg-primary-hover text-primary-foreground shadow-xs gap-2"
          disabled={!file || loading}
          onClick={handleUpload}
        >
          {loading ? (
            'Extracting Tech Stack & Matching Jobs...'
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Analyze Resume & Find Matched Roles
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
