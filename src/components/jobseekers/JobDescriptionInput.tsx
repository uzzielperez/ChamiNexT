import React, { useState, useCallback } from 'react';
import { FileText, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import { JobDescription } from '../../types/cvOptimization';
import { analyzeJobDescription, validateCVContent } from '../../utils/aiCVOptimizer';

interface JobDescriptionInputProps {
  onJobDescriptionAnalyzed: (jobDescription: JobDescription) => void;
  onCVContentChange: (content: string) => void;
  initialCVContent?: string;
  isLoading?: boolean;
  className?: string;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onJobDescriptionAnalyzed,
  onCVContentChange,
  initialCVContent = '',
  isLoading = false,
  className = ''
}) => {
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [cvContent, setCVContent] = useState(initialCVContent);
  const [analyzedJob, setAnalyzedJob] = useState<JobDescription | null>(null);
  const [cvValidation, setCVValidation] = useState<{ isValid: boolean; errors: string[] }>({ isValid: true, errors: [] });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleJobDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescriptionText(e.target.value);
    setAnalyzedJob(null); // Reset analysis when text changes
  }, []);

  const handleCVContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setCVContent(content);
    onCVContentChange(content);
    
    // Validate CV content
    const validation = validateCVContent(content);
    setCVValidation(validation);
  }, [onCVContentChange]);

  const handleAnalyzeJobDescription = useCallback(async () => {
    if (!jobDescriptionText.trim()) return;

    setIsAnalyzing(true);
    try {
      // Simulate analysis delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const analyzed = analyzeJobDescription(jobDescriptionText);
      setAnalyzedJob(analyzed);
      onJobDescriptionAnalyzed(analyzed);
    } catch (error) {
      console.error('Error analyzing job description:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobDescriptionText, onJobDescriptionAnalyzed]);

  const canStartOptimization = analyzedJob && cvValidation.isValid && cvContent.trim().length > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Job Description Input Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 text-gold-400 mr-3" />
          <h3 className="text-xl font-semibold text-white">Job Description</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="job-description" className="block text-sm font-medium text-gray-300 mb-2">
              Paste the job description you want to optimize your CV for:
            </label>
            <textarea
              id="job-description"
              value={jobDescriptionText}
              onChange={handleJobDescriptionChange}
              placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
              className="w-full h-40 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-vertical"
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleAnalyzeJobDescription}
            disabled={!jobDescriptionText.trim() || isAnalyzing || isLoading}
            className="w-full sm:w-auto"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Job Description
              </>
            )}
          </Button>
        </div>

        {/* Analysis Results */}
        {analyzedJob && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <h4 className="text-lg font-medium text-white">Analysis Complete</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Position:</span>
                <span className="text-white ml-2 font-medium">{analyzedJob.title}</span>
              </div>
              <div>
                <span className="text-gray-400">Company:</span>
                <span className="text-white ml-2 font-medium">{analyzedJob.company}</span>
              </div>
              <div>
                <span className="text-gray-400">Key Requirements:</span>
                <span className="text-white ml-2">{analyzedJob.requirements.length} found</span>
              </div>
              <div>
                <span className="text-gray-400">Keywords Identified:</span>
                <span className="text-white ml-2">{analyzedJob.keywords.length} keywords</span>
              </div>
            </div>

            {/* Keywords Preview */}
            {analyzedJob.keywords.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-300 mb-2">Top Keywords:</h5>
                <div className="flex flex-wrap gap-2">
                  {analyzedJob.keywords.slice(0, 8).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gold-500 bg-opacity-20 text-gold-300 text-xs rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                  {analyzedJob.keywords.length > 8 && (
                    <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                      +{analyzedJob.keywords.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CV Content Input Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 text-gold-400 mr-3" />
          <h3 className="text-xl font-semibold text-white">Your Current CV</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="cv-content" className="block text-sm font-medium text-gray-300 mb-2">
              Paste your current CV content or upload a file:
            </label>
            <textarea
              id="cv-content"
              value={cvContent}
              onChange={handleCVContentChange}
              placeholder="Paste your CV content here, or use the file upload feature above..."
              className="w-full h-48 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-vertical"
              disabled={isLoading}
            />
          </div>

          {/* CV Validation Messages */}
          {!cvValidation.isValid && cvValidation.errors.length > 0 && (
            <div className="flex items-start space-x-2 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-300 font-medium text-sm">CV Content Issues:</p>
                <ul className="text-red-200 text-sm mt-1 space-y-1">
                  {cvValidation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Success State */}
          {canStartOptimization && (
            <div className="flex items-center space-x-2 p-3 bg-green-900 bg-opacity-50 border border-green-500 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-300 text-sm">
                Ready to start CV optimization! Your job description has been analyzed and your CV content is valid.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gold-400">
            {jobDescriptionText.split(/\s+/).filter(word => word.length > 0).length}
          </div>
          <div className="text-sm text-gray-400">Job Desc Words</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gold-400">
            {cvContent.split(/\s+/).filter(word => word.length > 0).length}
          </div>
          <div className="text-sm text-gray-400">CV Words</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gold-400">
            {analyzedJob?.keywords.length || 0}
          </div>
          <div className="text-sm text-gray-400">Keywords Found</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gold-400">
            {analyzedJob?.requirements.length || 0}
          </div>
          <div className="text-sm text-gray-400">Requirements</div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionInput;