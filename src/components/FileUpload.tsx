import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, FileText, Loader2, CheckCircle, X, AlertCircle, Eye } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
  extractedText?: string;
  uploadProgress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  concepts?: string[];
  pageCount?: number;
}

interface ProcessedContent {
  text: string;
  concepts: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
  topics: string[];
  keyTerms: string[];
  equations?: string[];
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedContent, setProcessedContent] = useState<ProcessedContent | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFilePreview, setSelectedFilePreview] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced file validation
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is 10MB.`;
    }

    if (!allowedTypes.includes(file.type)) {
      return `File type "${file.type}" is not supported.`;
    }

    return null;
  };

  // Generate unique file ID
  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  // Simulate file upload with progress
  const simulateUpload = (fileId: string): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, uploadProgress: 100, status: 'processing' }
              : f
          ));
          resolve();
        } else {
          setFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, uploadProgress: Math.floor(progress) }
              : f
          ));
        }
      }, 200);
    });
  };

  // Enhanced drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processNewFiles(droppedFiles);
  }, []);

  // Process multiple files with validation
  const processNewFiles = async (newFiles: File[]) => {
    const validatedFiles: UploadedFile[] = [];
    
    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        continue;
      }

      const fileId = generateFileId();
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        status: 'uploading'
      };

      validatedFiles.push(uploadedFile);
    }

    if (validatedFiles.length === 0) return;

    setFiles(prev => [...prev, ...validatedFiles]);
    toast.success(`${validatedFiles.length} file(s) added for processing`);

    // Simulate upload for each file
    for (const file of validatedFiles) {
      await simulateUpload(file.id);
      
      // Simulate text extraction
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                status: 'completed',
                extractedText: generateMockExtractedText(file.name),
                concepts: generateMockConcepts(file.name),
                pageCount: Math.floor(Math.random() * 20) + 1
              }
            : f
        ));
      }, 1000);
    }
  };

  // File input handler
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    processNewFiles(selectedFiles);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Remove file
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success('File removed successfully');
  };

  // Process all completed files
  const processFiles = async () => {
    const completedFiles = files.filter(f => f.status === 'completed');
    if (completedFiles.length === 0) {
      toast.error('No completed files to process');
      return;
    }

    setIsProcessing(true);
    toast.loading('AI is analyzing your documents and building knowledge graph...');
    
    // Simulate AI processing
    setTimeout(() => {
      const mockProcessedContent: ProcessedContent = {
        text: completedFiles.map(f => f.extractedText).join('\n\n'),
        concepts: Array.from(new Set(completedFiles.flatMap(f => f.concepts || []))),
        difficulty: 'intermediate',
        subject: 'Physics',
        topics: ['Electromagnetic Waves', 'Wave Properties', 'Light Spectrum', 'Energy Transfer'],
        keyTerms: ['frequency', 'wavelength', 'amplitude', 'electromagnetic spectrum', 'photon energy'],
        equations: ['c = λf', 'E = hf', 'I = P/A']
      };
      
      setProcessedContent(mockProcessedContent);
      setIsProcessing(false);
      toast.success('Documents processed successfully! Ready to generate study materials.');
    }, 3000);
  };

  // Generate mock extracted text
  const generateMockExtractedText = (filename: string): string => {
    const topics = [
      'electromagnetic waves', 'quantum mechanics', 'thermodynamics', 
      'calculus', 'organic chemistry', 'biology', 'history'
    ];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    return `Chapter: ${topic.toUpperCase()}\n\nThis document covers fundamental concepts in ${topic}. Key principles include various theories and applications that are essential for understanding this subject area. The material progresses from basic definitions to advanced applications, providing comprehensive coverage suitable for academic study.`;
  };

  // Generate mock concepts
  const generateMockConcepts = (filename: string): string[] => {
    const conceptSets = {
      physics: ['Wave-Particle Duality', 'Electromagnetic Spectrum', 'Energy Conservation', 'Frequency Analysis'],
      math: ['Calculus Fundamentals', 'Differential Equations', 'Integration Techniques', 'Limit Theory'],
      chemistry: ['Molecular Structure', 'Chemical Bonding', 'Reaction Mechanisms', 'Thermochemistry'],
      biology: ['Cell Biology', 'Genetics', 'Ecosystems', 'Evolution'],
      default: ['Key Concepts', 'Core Principles', 'Applications', 'Theory']
    };

    const type = filename.toLowerCase().includes('physics') ? 'physics' :
                 filename.toLowerCase().includes('math') ? 'math' :
                 filename.toLowerCase().includes('chem') ? 'chemistry' :
                 filename.toLowerCase().includes('bio') ? 'biology' : 'default';

    return conceptSets[type];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('text')) return '📝';
    if (type.includes('word')) return '📄';
    return '📁';
  };

  return (
    <div className="space-y-6">
      <Card className="glass hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Study Materials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enhanced Drop Zone */}
          <motion.div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragOver 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ 
                scale: isDragOver ? 1.1 : 1,
                color: isDragOver ? '#8b5cf6' : '#6b7280'
              }}
            >
              <Upload className="mx-auto h-12 w-12 mb-4" />
            </motion.div>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragOver ? 'Drop your files here!' : 'Drag & drop your study materials'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.png,.jpg,.jpeg,.webp,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" className="mt-2" asChild>
                  <span>Browse Files</span>
                </Button>
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Supports PDF, DOC, TXT, PNG, JPG, WEBP (Max 10MB each)
            </p>
          </motion.div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Uploaded Files ({files.length})</h4>
                  <Button 
                    onClick={processFiles} 
                    disabled={isProcessing || files.every(f => f.status !== 'completed')}
                    size="sm"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Process All Files'
                    )}
                  </Button>
                </div>

                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border"
                  >
                    <div className="text-2xl">{getFileIcon(file.type)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{file.name}</span>
                        <Badge variant={
                          file.status === 'completed' ? 'default' :
                          file.status === 'processing' ? 'secondary' :
                          file.status === 'error' ? 'destructive' : 'outline'
                        }>
                          {file.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        {file.pageCount && <span>{file.pageCount} pages</span>}
                        {file.concepts && (
                          <span>{file.concepts.length} concepts identified</span>
                        )}
                      </div>

                      {file.status === 'uploading' && (
                        <Progress value={file.uploadProgress} className="mt-2 h-1" />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {file.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFilePreview(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* File Preview Modal */}
      <AnimatePresence>
        {selectedFilePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedFilePreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{selectedFilePreview.name}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedFilePreview(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-96">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Extracted Content:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line bg-muted p-3 rounded">
                      {selectedFilePreview.extractedText}
                    </p>
                  </div>
                  {selectedFilePreview.concepts && (
                    <div>
                      <h4 className="font-medium mb-2">Identified Concepts:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedFilePreview.concepts.map((concept, index) => (
                          <Badge key={index} variant="outline">{concept}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processed Content Display */}
      <AnimatePresence>
        {processedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-girl hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Knowledge Graph Generated! ✨
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Amazing! Your documents have been processed and concepts have been extracted. 
                    You can now generate personalized quizzes, flashcards, and study plans! 🎉
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      📊 Analysis Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subject:</span>
                        <Badge variant="outline">{processedContent.subject}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <Badge variant={processedContent.difficulty === 'advanced' ? 'destructive' : 'default'}>
                          {processedContent.difficulty}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Concepts Found:</span>
                        <span className="font-medium">{processedContent.concepts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Key Terms:</span>
                        <span className="font-medium">{processedContent.keyTerms.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      🎯 Main Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {processedContent.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary">{topic}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    🧠 Key Concepts
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {processedContent.concepts.map((concept, index) => (
                      <Badge key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>

                {processedContent.equations && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      🔢 Important Equations
                    </h4>
                    <div className="bg-muted p-4 rounded-lg">
                      {processedContent.equations.map((equation, index) => (
                        <div key={index} className="font-mono text-sm mb-2 last:mb-0">
                          {equation}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" onClick={() => {/* Navigate to quiz */}}>
                    Generate Quiz 🧠
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {/* Navigate to flashcards */}}>
                    Create Flashcards 💡
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {/* Navigate to planner */}}>
                    Study Plan 📅
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}