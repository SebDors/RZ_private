import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, X } from 'lucide-react';
import { getToken } from '@/lib/utils';

const csvMimeTypes = [
  'text/csv',
];

export default function ImportData() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (file: File) => {
    if (isCsvFile(file)) {
      // Prevent adding duplicate files
      if (!selectedFiles.some((f) => f.name === file.name && f.lastModified === file.lastModified)) {
        setSelectedFiles([file]); // Replace previous file with the new one
      } else {
        toast.warning(`File "${file.name}" is already added.`);
      }
    } else {
      toast.error(`File "${file.name}" is not a valid CSV file.`);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles(selectedFiles.filter((file) => file.name !== fileName));
  };

  const isCsvFile = (file: File) => {
    return csvMimeTypes.includes(file.type) || file.name.endsWith('.csv');
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('No file selected for upload.');
      return;
    }

    const file = selectedFiles[0];
    const formData = new FormData();
    formData.append('diamonds_csv', file);
    const token = getToken();

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/diamants/upload_data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'File uploaded successfully!');
        setSelectedFiles([]);
      } else {
        toast.error(data.message || 'File upload failed.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during file upload.');
    }
  };

  return (
    <div className="p-8 bg-secondary h-full">
      <Card>
        <CardHeader>
          <CardTitle>Import Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`flex items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`
            }
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleDivClick}
          >
            <div className="text-center">
              <p className="text-lg text-gray-500">Drag & drop your CSV file here</p>
              <p className="text-sm text-gray-400">or click to select a file</p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,text/csv"
            className="hidden"
          />
          <div className="mt-4 space-y-2">
            {selectedFiles.map((file) => (
              <div key={file.name} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  <span>{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
