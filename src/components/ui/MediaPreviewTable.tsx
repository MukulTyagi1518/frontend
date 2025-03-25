import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import Image from "next/image";

// ✅ Define Type for MediaItem
type MediaItem = {
  mediaName: string;
  imageUrl?: string;
  videoUrl?: string;
};

// ✅ Define Type for Component Props
interface MediaPreviewTableProps {
  uploadedData: MediaItem[];
}

const MediaPreviewTable: React.FC<MediaPreviewTableProps> = ({ uploadedData }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // ✅ Explicitly define 'media' type
  const handlePreview = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsOpen(true);
  };

  // ✅ Define Props for MediaPreview Component
  const MediaPreview: React.FC<{ media: MediaItem | null }> = ({ media }) => {
    if (!media) return null;

    return (
      <div className="flex flex-col gap-4 items-center justify-center">
        {media.imageUrl && (
          <div className="w-full max-w-2xl">
            <Image
              src={media.imageUrl}
              alt={media.mediaName}
              className="w-full h-auto rounded-lg"
              width={800}
              height={600}
            />
          </div>
        )}
        {media.videoUrl && (
          <div className="w-full max-w-2xl">
            <video controls className="w-full h-auto rounded-lg">
              <source src={media.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-neutral-600 m-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">File Name</TableHead>
              <TableHead className="text-right">Preview</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploadedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No files uploaded
                </TableCell>
              </TableRow>
            ) : (
              // ✅ Explicitly type 'item' as MediaItem and 'index' as number
              uploadedData.map((item: MediaItem, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.mediaName}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(item)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.mediaName}</DialogTitle>
          </DialogHeader>
          <MediaPreview media={selectedMedia} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaPreviewTable;
