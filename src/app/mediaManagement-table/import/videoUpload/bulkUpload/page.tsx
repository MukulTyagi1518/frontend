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
import MediaPreviewTable from "@/components/ui/MediaPreviewTable";
import FilesTable from "@/components/ui/FilesTable";
export default function ImportPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressImages, setUploadProgressImages] = useState(0);
  const [isVideosUploaded, setIsVideosUploaded] = useState(false);
  const storedRedisKey = Cookies.get("redisKey");
  const [uploadedData, setUploadedData] = useState();


  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget;
  }

  const handleFileChange = (event: FileChangeEvent) => {
    const files: File[] = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleFileChange1 = (event: FileChangeEvent) => {
    const files: File[] = Array.from(event.target.files || []);
    setSelectedImages(files);
  };


  const generatePresignedUrls = async () => {
    const response = await fetch(
      "https://5600bev1n3.execute-api.ap-south-1.amazonaws.com/dev/api/fitnearn/web/admin/bulk-upload/generate-presigned-urls",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redisKey: storedRedisKey,
          inputType: "Video",
          //NEXT_BULK_IMAGES_FOR_VIDEOS: true,
        }),
      }
    );
    console.log("response from the generate presigned url", response);
    return await response.json();
  };

  const generatePresignedUrls1 = async () => {
    const response = await fetch(
      "https://5600bev1n3.execute-api.ap-south-1.amazonaws.com/dev/api/fitnearn/web/admin/bulk-upload/generate-presigned-urls",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redisKey: storedRedisKey,
          inputType: "Image",
          NEXT_BULK_IMAGES_FOR_VIDEOS: true,
        }),
      }
    );
    console.log("response from the generate presigned url", response);
    return await response.json();
  };

  // Handle bulk upload logic
  const handleBulkUpload = async () => {
    try {
      setLoading(true);
      setError("");
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
            inputType: "Video",
            //nextBulkFlag: true
          }),
        }
      );

      const validateData = await validateResponse.json();
      if (!validateData.success) throw new Error("Validation failed");
      console.log("Validation successful");
      setIsVideosUploaded(true);
      // Round 1 complete

      showToast({
        type: "success",
        title: "Videos Uploaded!",
        description: "Please upload related thumbnails!",
        actionText: "OK",
        onAction: () => {
          // router.push("/mediaManagement-table/s3Preview");
        },
      });
    } catch (err) {
      setError(err.message || "Error uploading media files");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload1 = async () => {
    //round 2 start
    try {
      setLoading(true);
      setError("");
      setUploadProgressImages(0);

      const { presignedUrls } = await generatePresignedUrls1();

      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        const presignedUrl = presignedUrls[i]?.preSignedUrl;

        if (!presignedUrl) {
          throw new Error(`No presigned URL for file: ${file.name}`);
        }

        await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        setUploadProgressImages(((i + 1) / selectedImages.length) * 100);
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
            nextBulkFlag: true,
          }),
        }
      );

      const validateData = await validateResponse.json();
      if (!validateData.success) throw new Error("Validation failed");
      console.log("Validation successful");

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
        console.log("Uploaded data", insertData.data);
      }
      setUploadedData(insertData.data);

      // Clear cache
      await fetch(
        "https://5600bev1n3.execute-api.ap-south-1.amazonaws.com/dev/api/fitnearn/web/admin/bulk-upload/clear-cache",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ redisKey: storedRedisKey }),
        }
      );
      console.log("Bulk insert successful");

      // Clear Cookies redis key
      Cookies.remove("redisKey");
      Cookies.remove("importMediaType");
      showToast({
        type: "success",
        title: "Uploaded!",
        description: "Your details have been uploaded successfully.",
        actionText: "OK",
        onAction: () => {
          // router.push("/mediaManagement-table/s3Preview");
        },
      });
      console.log("Upload Success");
    } catch (error) {
      console.error(error);
      setError(error.message || "Error uploading media files");
    }
  };

  return (
    <div className="w-full min-h-screen bg-black-900 text-white">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div
        className={`w-full flex-1 absolute left-0 top-0 transition-all duration-300 ease-in-out ${isOpen ? "pl-60" : "pl-16"
          }`} // Adjust padding based on sidebar state
      >
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="container mx-auto py-10 pt-24 pr-5 pl-[280px]">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 flex items-center space-x-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M13 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H13C14.1046 19 15 18.1046 15 17V7C15 5.89543 14.1046 5 13 5Z"
                fill="#FAFAFA"
              />
              <path
                d="M21.5 6.3C21.3485 6.21132 21.1763 6.16408 21.0008 6.16302C20.8253 6.16197 20.6525 6.20714 20.5 6.294L17 8.284V15.817L20.465 18.017C20.6166 18.113 20.7912 18.1664 20.9706 18.1717C21.15 18.177 21.3275 18.1339 21.4844 18.047C21.6414 17.9601 21.7721 17.8325 21.8628 17.6777C21.9535 17.5228 22.0009 17.3464 22 17.167V7.167C22.0002 6.9913 21.954 6.81865 21.8663 6.66645C21.7785 6.51424 21.6522 6.38785 21.5 6.3Z"
                fill="#FAFAFA"
              />
            </svg>
            <span className="text-lg text-white">Media Management</span>
            <span className="text-lg text-white">›</span>
            <span className="text-lg text-white">Import</span>
          </div>

          {/* Border Container */}
          {!isVideosUploaded && (
            <div className="border border-gray-600 rounded-md">
              {!uploadedData && (
                <div>
                  <div className="flex items-center justify-center w-[600px] m-auto py-20">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col h-[400px] items-center justify-center w-full border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Click to upload Video files
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">MP4</p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        multiple
                        accept="video/*"
                      />
                    </label>
                  </div>
                </div>
              )}


              {selectedFiles.length > 0 && !uploadedData && (
                <FilesTable selectedFiles={selectedFiles} />
              )}
              {selectedImages.length > 0 && !uploadedData && (
                <FilesTable selectedFiles={selectedImages} />
              )}

              {loading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-gray-600 text-center">
                    Uploading... {uploadProgress.toFixed(0)}%
                  </p>
                </div>
              )}

              {/* Bulk Upload Button */}
              <div className="px-4 py-4 flex justify-end">
                <Button className="  px-6 py-2 " onClick={handleBulkUpload}>
                  Upload
                </Button>
              </div>
            </div>
          )}

          {/* Now upload the thumbnail images for the videos */}
          {isVideosUploaded && !uploadedData && (
            <div className="border border-gray-600 rounded-md">
              <div>
                <div className="flex items-center justify-center w-[600px] m-auto py-20">
                  <label
                    htmlFor="dropzone-file-img"
                    className="flex flex-col h-[400px] items-center justify-center w-full border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">
                          Click to upload files
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        SVG, PNG, JPG (MAX. 30 MB)
                      </p>
                    </div>
                    <input
                      id="dropzone-file-img"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange1}
                      multiple
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              {/* Selected Files Preview */}
              {selectedImages.length > 0 && (
                <div className="px-4 py-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Selected Thumbnail Files:
                  </h3>
                  <ul className="space-y-2">
                    {selectedImages.map((file, index) => (
                      <li key={index} className="text-sm text-gray-400">
                        {file.name} - {file.type} - {file.size}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {loading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-gray-600 text-center">
                    Uploading... {uploadProgress.toFixed(0)}%
                  </p>
                </div>
              )}

              {/* Bulk Upload Button */}
              <div className="px-4 py-4 flex justify-end">
                <Button className="  px-6 py-2 " onClick={handleBulkUpload1}>
                  Upload
                </Button>
              </div>
            </div>
          )}

          {uploadedData && uploadedData?.length > 0 && (
            <MediaPreviewTable uploadedData={uploadedData} />
          )}
        </div>
      </div>
    </div>
  );
}
