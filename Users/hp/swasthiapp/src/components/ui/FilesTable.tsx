import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ✅ Define File type
type FileData = {
  name: string;
  type: string;
  size: number;
};

// ✅ Define component props
interface FilesTableProps {
  selectedFiles: FileData[];
}

const FilesTable: React.FC<FilesTableProps> = ({ selectedFiles }) => {
  // ✅ Explicitly define 'bytes' as number
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="rounded-md border mx-10 my-2 border-neutral-600">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedFiles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No files selected
              </TableCell>
            </TableRow>
          ) : (
            // ✅ Explicitly define 'file' as FileData and 'index' as number
            selectedFiles.map((file: FileData, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{file.name}</TableCell>
                <TableCell>{file.type || "Unknown"}</TableCell>
                <TableCell className="text-right">{formatFileSize(file.size)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FilesTable;
