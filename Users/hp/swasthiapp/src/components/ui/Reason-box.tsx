"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ReactNode } from "react";
import { useState } from "react";

interface ReasonBoxProps {
  title: string; // Dynamic title for the header
  buttonLabel: string; // Dynamic label for the button
  buttonIcon?: ReactNode; // Optional dynamic icon for the button
  onButtonClick?: (comment: string, visibility: boolean) => void;
  textareaBgColor?: string; // Background color for the Textarea
  comment?: string;  // Add this line
  setComment?: React.Dispatch<React.SetStateAction<string>>;  // Add this line
  visibility?: boolean;  // Add this line
  setVisibility?: React.Dispatch<React.SetStateAction<boolean>>;  // Add this line
}

export default function ReasonBox({
  title,
  buttonLabel,
  buttonIcon,
  onButtonClick,
  textareaBgColor = "bg-neutral-800",
  comment: propComment,               // Props from parent
  setComment: setPropComment,
  visibility: propVisibility,
  setVisibility: setPropVisibility,
}: ReasonBoxProps) {
  // Use prop state if provided, otherwise use local state
  const [localComment, setLocalComment] = useState("");
  const [localVisibility, setLocalVisibility] = useState(false);

  const comment = propComment !== undefined ? propComment : localComment;
  const setComment = setPropComment !== undefined ? setPropComment : setLocalComment;

  const visibility = propVisibility !== undefined ? propVisibility : localVisibility;
  const setVisibility = setPropVisibility !== undefined ? setPropVisibility : setLocalVisibility;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick(comment, visibility);  // Send the correct state
    }
  };

  const handleVisibilityChange = (checked: boolean | "indeterminate") => {
    setVisibility(checked === true);
  };

  return (
    <Card className="w-full max-w-3xl border-0 p-0">
      <CardHeader className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white -ml-[21px]">{title}</h2>
          <div className="flex items-center -mr-[21px]">
            <Checkbox
              id="visible"
              className="border-neutral-600"
              checked={visibility}
              onCheckedChange={handleVisibilityChange}
            />
            <label htmlFor="visible" className="text-sm font-medium text-white ml-2">
              Comment visible to user
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 border border-neutral-600 rounded-lg overflow-hidden">
        <div className="space-y-4">
          <Textarea
            placeholder="Write text here ..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}  // Controlled input
            className={`min-h-[200px] ${textareaBgColor} border-b border-neutral-600 text-white resize-none rounded-none`}
          />
          <div className="flex justify-end p-2 pt-0 pb-4">
            <Button className="bg-neutral-600 text-white gap-2" size="lg" onClick={handleButtonClick}>
              {buttonIcon}
              {buttonLabel}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
