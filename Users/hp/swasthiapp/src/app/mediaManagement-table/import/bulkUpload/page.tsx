"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast/toast-context";
import Cookies from "js-cookie";
import { Progress } from "@/components/ui/progress";
import FilesTable from "@/components/ui/FilesTable";
import MediaPreviewTable from "@/components/ui/MediaPreviewTable";

interface MediaItem {
  mediaName: string;
  imageUrl?: string;
  videoUrl?: string;
}

export default function ImportPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedData, setUploadedData] = useState<MediaItem[] | undefined>();
  const storedRedisKey = Cookies.get("redisKey");
  const [isOpen, setIsOpen] = useState(true);

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget;
  }

  const handleFileChange = (event: FileChangeEvent) => {
    const files: File[] = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  // Generating the presigned URLs
  const generatePresignedUrls = async () => {
    const response = await fetch(
      "https://5600bev1n3.execute-api.ap-south-1.amazonaws.com/dev/api/fitnearn/web/admin/bulk-upload/generate-presigned-urls",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redisKey: storedRedisKey,
          inputType: "Image",
        }),
      }
    );
    return await response.json();
  };

  // Handle bulk upload logic
  const handleBulkUpload = async () => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      const { presignedUrls } = await generatePresignedUrls();

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const presignedUrl = presignedUrls[i]?.preSignedUrl;

        if (!presignedUrl) {
          throw new Error(`No presigned URL for file: ${file.name}`);
        }

        await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      // Validate upload
      const validateResponse = await fetch(
        "https://5600bev1n3.execute-api.ap-south-1.amazonaws.com/dev/api/fitnearn/web/admin/bulk-upload/validate-upload",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            redisKey: storedRedisKey,
            inputType: "Image",
          }),
        }
      );

      const validateData = await validateResponse.json();
      if (!validateData.success) throw new Error("Validation failed");

      // Bulk insert
      const insertResponse = await fetch(
        "https://5600bev1n3.execute-api.ap-south-1.amazonaws.com/dev/api/fitnearn/web/admin/bulk-upload/bulkInsertMedia",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ redisKey: storedRedisKey }),
        }
      );

      const insertData = await insertResponse.json();
      if (!insertData.success) throw new Error("Bulk insert failed");

      if (insertData.data) {
        setUploadedData(insertData.data);
      }

      // Clear cache
      await fetch(
        "https://5600bev1n3.execute-api.ap-south-1.amazonaws.com/dev/api/fitnearn/web/admin/bulk-upload/clear-cache",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ redisKey: storedRedisKey }),
        }
      );

      // Clear Cookies
      Cookies.remove("redisKey");
      Cookies.remove("importMediaType");

      showToast({
        type: "success",
        title: "Uploaded!",
        description: "Your details have been uploaded successfully.",
        actionText: "OK",
      });

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black-900 text-white">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div
        className={`w-full flex-1 absolute left-0 top-0 transition-all duration-300 ease-in-out ${
          isOpen ? "pl-60" : "pl-16"
        }`}
      >
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="container mx-auto py-10 pt-24 pr-5 pl-[280px]">
          {/* Border Container */}
          <div className="border border-gray-600 rounded-md">
            {!uploadedData && (
              <div>
                <div className="flex items-center justify-center w-[600px] m-auto py-20">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col h-[400px] items-center justify-center w-full border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload files</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        SVG, PNG, JPG, GIF, or MP4 (MAX. 30 MB)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*,video/*"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && !uploadedData && (
              <FilesTable selectedFiles={selectedFiles} />
            )}

            {loading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-gray-600 text-center">
                  Uploading... {uploadProgress.toFixed(0)}%
                </p>
              </div>
            )}

            {uploadedData && uploadedData.length > 0 && (
              <MediaPreviewTable uploadedData={uploadedData} />
            )}

            {/* Bulk Upload Button */}
            <div className="px-4 py-4 flex justify-end">
              <Button className="px-6 py-2" onClick={handleBulkUpload}>
                Upload
              </Button>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
