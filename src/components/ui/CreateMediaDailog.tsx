"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

export function CreateMediaDialog() {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const router = useRouter();

  const handleImport = () => {
    if (selectedOption) {
      Cookies.set("importMediaType", selectedOption);
      if (selectedOption === "Image") {
        router.push("/mediaManagement-table/create/form");
      } else if (selectedOption === "Video") {
        router.push("/mediaManagement-table/create/videoUpload/form");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-neutral-800 text-white flex items-center space-x-2 hover:bg-gray-700">
          <span>New</span>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 text-white">
        <DialogHeader>
          <DialogTitle>New Media</DialogTitle>
          <DialogDescription>
            Choose the type of media you want to create.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup onValueChange={setSelectedOption} className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Image" id="image" />
              <Label htmlFor="image">Image</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Video" id="video" />
              <Label htmlFor="video">Video</Label>
            </div>
          </RadioGroup>
        </div>
        <Button
          onClick={handleImport}
          disabled={!selectedOption}
          className="w-full"
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
