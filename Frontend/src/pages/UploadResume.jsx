import { useNavigate } from 'react-router-dom';

import ResumeUpload from '../components/ResumeUpload';

import { Button } from '@/components/ui/button';

import { ArrowLeft } from 'lucide-react';


const UploadResume = () => {

  const navigate = useNavigate();


  return (
    <main className="min-h-screen">

      <section className="container mx-auto px-6 py-12">

        <div className="max-w-3xl mx-auto">

          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />

            Back
          </Button>


          <div className="text-center mb-10">

            <h1 className="text-4xl md:text-5xl font-bold">
              Upload Your Resume
            </h1>

            <p className="mt-4 text-muted-foreground text-lg">
              Upload your PDF resume and we'll find
              jobs that match your skills.
            </p>

          </div>


          <ResumeUpload
            onSuccess={(resume) => {

              navigate(
                `/?resume=${resume._id}`
              );

            }}
          />

        </div>

      </section>

    </main>
  );
};


export default UploadResume;