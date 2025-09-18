'use client';

import { useState } from 'react';
import { Upload, CheckCircle, Link, ArrowLeft, X } from 'lucide-react';

// Types
interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface FormData {
  agentName: string;
  agentDescription: string;
  knowledgeInstructions: string;
  uploadedFiles: UploadedFile[];
}


// FIXED: Move components outside to prevent re-creation
const CreateAgentForm = ({ formData, handleInputChange, handleCreateAgent, handleFileUpload, handleRemoveFile, formatFileSize, isCreating }: {
  formData: FormData;
  handleInputChange: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateAgent: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (index: number) => void;
  formatFileSize: (bytes: number) => string;
  isCreating: boolean;
}) => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your AI Training Agent</h1>
      <p className="text-gray-600">Build a custom AI agent with your knowledge base for interactive training sessions.</p>
    </div>
    
    {/* Agent Basic Info */}
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
        <input 
          key="agent-name-input"
          type="text"
          placeholder="Agent Name (e.g., Sales Training Coach)"
          value={formData.agentName}
          onChange={handleInputChange('agentName')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Agent Description</label>
        <textarea 
          key="agent-description-input"
          placeholder="Brief description of your AI agent's purpose"
          value={formData.agentDescription}
          onChange={handleInputChange('agentDescription')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none text-gray-900 placeholder-gray-500 bg-white"
          autoComplete="off"
        />
      </div>
    </div>

    {/* Knowledge Instructions Box */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Knowledge & Instructions</label>
      <textarea 
        key="knowledge-instructions-input"
        rows={8}
        placeholder="Enter detailed instructions for your AI agent. Example:

You are an experienced sales training coach for TechCorp Solutions. Your role is to:
- Help employees practice sales conversations
- Provide feedback on objection handling techniques
- Share best practices for closing deals
- Answer questions about our product portfolio
- Guide employees through role-play scenarios

Use a supportive and encouraging tone. Draw from the uploaded knowledge base to provide accurate, company-specific information."
        value={formData.knowledgeInstructions}
        onChange={handleInputChange('knowledgeInstructions')}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 bg-white"
        autoComplete="off"
      />
    </div>

    {/* File Upload Area */}
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Knowledge Base</h3>
        <p className="text-gray-600 mb-2">Drag and drop files or click to browse</p>
        <p className="text-sm text-gray-500 mb-4">
          Supported formats: PDF, DOCX, TXT, CSV (Max 10MB per file)
        </p>
        <input 
          type="file" 
          multiple 
          accept=".pdf,.docx,.txt,.csv" 
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label 
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
        >
          Choose Files
        </label>
      </div>
      
      {/* Show uploaded files list */}
      {formData.uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          {formData.uploadedFiles.map((file, idx) => (
            <div key={`file-${file.name}-${idx}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-medium">
                    {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button 
                onClick={() => handleRemoveFile(idx)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Action Buttons */}
    <div className="flex justify-between">
      <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
        Cancel
      </button>
      <button 
        onClick={handleCreateAgent}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={!formData.agentName || !formData.knowledgeInstructions || isCreating}
      >
        {isCreating ? 'Creating Agent...' : 'Create AI Agent'}
      </button>
    </div>
  </div>
);

const AgentCreatedSuccess = ({ formData, handleGenerateMeeting, setCurrentPage }: {
  formData: FormData;
  handleGenerateMeeting: () => void;
  setCurrentPage: (page: 'create-form' | 'agent-created' | 'meeting-generated') => void;
}) => (
  <div className="max-w-2xl mx-auto p-6 text-center">
    <div className="mb-8">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agent Created Successfully!</h1>
      <p className="text-gray-600">Your AI training agent &ldquo;{formData.agentName}&rdquo; is ready to use.</p>
    </div>

    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Details</h3>
      <div className="text-left space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-500">Name:</span>
          <p className="text-gray-900">{formData.agentName}</p>
        </div>
        {formData.agentDescription && (
          <div>
            <span className="text-sm font-medium text-gray-500">Description:</span>
            <p className="text-gray-900">{formData.agentDescription}</p>
          </div>
        )}
        <div>
          <span className="text-sm font-medium text-gray-500">Knowledge Files:</span>
          <p className="text-gray-900">{formData.uploadedFiles.length} files uploaded</p>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">What would you like to do next?</h3>
      <div className="grid gap-4">
        <button 
          onClick={handleGenerateMeeting}
          className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Link className="w-5 h-5" />
          <span>Generate Meeting Link</span>
        </button>
        <button 
          onClick={() => setCurrentPage('create-form')}
          className="w-full p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Create Another Agent</span>
        </button>
      </div>
    </div>
  </div>
);

const MeetingGenerated = ({ formData, meetingLink, setCurrentPage }: {
  formData: FormData;
  meetingLink: string;
  setCurrentPage: (page: 'create-form' | 'agent-created' | 'meeting-generated') => void;
}) => (
  <div className="max-w-2xl mx-auto p-6 text-center">
    <div className="mb-8">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting Link Generated!</h1>
      <p className="text-gray-600">Your AI training session is ready to begin.</p>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-medium text-blue-900 mb-4">Meeting Details</h3>
      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-blue-700">Agent:</span>
          <p className="text-blue-900 font-medium">{formData.agentName}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-blue-700">Meeting Link:</span>
          <div className="mt-2 p-3 bg-white rounded border border-blue-200">
            <code className="text-sm text-blue-900 break-all">{meetingLink}</code>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <button 
        onClick={() => navigator.clipboard.writeText(meetingLink)}
        className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Copy Meeting Link
      </button>
      <button 
        onClick={() => window.open(meetingLink, '_blank')}
        className="w-full p-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
      >
        Open Meeting
      </button>
      <button 
        onClick={() => setCurrentPage('create-form')}
        className="w-full p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Create Another Agent</span>
      </button>
    </div>
  </div>
);

// Main Component
export default function AIAgentCreator() {
  const [currentPage, setCurrentPage] = useState<'create-form' | 'agent-created' | 'meeting-generated'>('create-form');
  const [formData, setFormData] = useState<FormData>({
    agentName: '',
    agentDescription: '',
    knowledgeInstructions: '',
    uploadedFiles: []
  });
  const [isCreating, setIsCreating] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');

  // CORRECT: Fixed input change handlers
  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateAgent = async () => {
    if (!formData.agentName || !formData.knowledgeInstructions) return;
    
    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsCreating(false);
    setCurrentPage('agent-created');
  };

  const handleGenerateMeeting = async () => {
    // Simulate meeting generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMeetingLink('https://meet.zemo.com/ai-agent-session-12345');
    setCurrentPage('meeting-generated');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles: UploadedFile[] = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...newFiles]
    }));
    
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  };


  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  // Render current page - FIXED: Use CSS visibility instead of conditional rendering
  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ display: currentPage === 'create-form' ? 'block' : 'none' }}>
        <CreateAgentForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleCreateAgent={handleCreateAgent}
          handleFileUpload={handleFileUpload}
          handleRemoveFile={handleRemoveFile}
          formatFileSize={formatFileSize}
          isCreating={isCreating}
        />
      </div>
      <div style={{ display: currentPage === 'agent-created' ? 'block' : 'none' }}>
        <AgentCreatedSuccess 
          formData={formData}
          handleGenerateMeeting={handleGenerateMeeting}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <div style={{ display: currentPage === 'meeting-generated' ? 'block' : 'none' }}>
        <MeetingGenerated 
          formData={formData}
          meetingLink={meetingLink}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
