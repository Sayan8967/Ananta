"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Camera, FileImage, X, Loader2 } from "lucide-react";

// =============================================================================
// PrescriptionUploader - Drag-drop / camera prescription uploader
// =============================================================================

interface PrescriptionUploaderProps {
  onUpload?: (file: File) => void;
}

export function PrescriptionUploader({ onUpload }: PrescriptionUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        return;
      }
      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    },
    []
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;
    setUploading(true);
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onUpload?.(selectedFile);
    setUploading(false);
  }, [selectedFile, onUpload]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  }, []);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {!selectedFile && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleInputChange}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Drag and drop your prescription here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports JPG, PNG, and PDF files
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Camera button */}
      {!selectedFile && (
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}

      {!selectedFile && (
        <div className="flex justify-center">
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleInputChange}
          />
          <Button
            variant="outline"
            onClick={() => cameraRef.current?.click()}
            className="gap-2"
          >
            <Camera className="h-4 w-4" />
            Take a Photo
          </Button>
        </div>
      )}

      {/* Preview */}
      {selectedFile && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Prescription preview"
                  className="h-32 w-32 object-cover rounded-lg border"
                />
              ) : (
                <div className="h-32 w-32 rounded-lg border bg-muted flex items-center justify-center">
                  <FileImage className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="gap-2"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploading ? "Processing..." : "Upload & Analyze"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearFile}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
