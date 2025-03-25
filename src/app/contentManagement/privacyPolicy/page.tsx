"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/SideBarDesign";

const Editor = dynamic(() => import("@/components/ui/contentEditor"), {
  ssr: false,
});

type BlockData = {
  text?: string;
  level?: number;
  items?: string[];
  style?: string;
};

type Block = {
  type: "header" | "paragraph" | "list";
  data: BlockData;
};

type Content = {
  time: number;
  blocks: Block[];
};

const Aboutus = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<Content>({
    time: 0,
    blocks: [],
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Function to fetch content from the API
  const fetchContent = async () => {
    try {
      const response = await fetch(
        `https://swasthiadmin.api.fitnearn.com/api/aboutus`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();
      console.log("Fetched data:", data); // Log the entire response

      if (response.ok && data.content && Array.isArray(data.content.blocks)) {
        setContent(data.content);
      } else {
        console.error("Failed to fetch content or invalid structure", data);
        setContent({
          time: Date.now(),
          blocks: [
            { type: "header", data: { text: "Default Header", level: 2 } },
            { type: "paragraph", data: { text: "No content available" } },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setContent({
        time: Date.now(),
        blocks: [
          { type: "header", data: { text: "Default Header", level: 2 } },
          { type: "paragraph", data: { text: "Error fetching content" } },
        ],
      });
    }
  };

  // Call fetchContent on component mount
  useEffect(() => {
    fetchContent();
  }, [API_URL]);

  // Handle editor change and update content
  const handleEditorChange = (updatedContent: Content) =>
    setContent(updatedContent);

  // Save updated content to the database and update UI immediately
  const saveContentToDatabase = async () => {
    try {
      const response = await fetch(`${API_URL}/api/aboutus`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        throw new Error("Failed to save content");
      }

      const result = await response.json();
      console.log("Content saved:", result);
      window.location.reload();
      // Fetch and update content after save
      fetchContent(); // Re-fetch the content to get the updated data
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Error saving content");
    }
  };

  // Render text with HTML tags
  const renderText = (text: string | undefined) => {
    if (typeof text !== "string") return null;
    text = text
      .replace(/&nbsp;/g, " ")
      .replace(/<b>/g, "<strong>")
      .replace(/<\/b>/g, "</strong>");
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  // Render block based on type (header, paragraph, list)
  const renderBlock = (block: Block, index: number) => {
    if (!block?.data) return null; // Ensure block data is present

    switch (block.type) {
      case "header":
        return (
          <h2
            key={index}
            className="text-xl md:text-2xl font-semibold text-white mb-2"
          >
            {block.data.text}
          </h2>
        );
      case "paragraph":
        return (
          <p key={index} className="text-sm md:text-base text-gray-300">
            {renderText(block.data.text)}
          </p>
        );
      case "list":
        return (
          <ul
            key={index}
            className={`list-${block.data.style} list-inside text-sm md:text-base text-gray-300 ml-4 space-y-1`}
          >
            {block.data.items?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );

      default:
        return null;
    }
  };

  return (
    <>
     <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

{/* Main Content */}
<div
  className={`w-full flex-1 absolute left-0 top-0 transition-all duration-300 ease-in-out ${
    isOpen ? "pl-60" : "pl-16"
  }`} // Adjust padding based on sidebar state
>
  <Header isOpen={isOpen} setIsOpen={setIsOpen}  />

      <div className="container h-auto mx-auto py-10 pt-10 pr-10 pl-[60px]">
     

      {/* Main Content */}
    
        {/* <div
        className={`w-full flex-1 absolute left-0 top-0 transition-all duration-300 ease-in-out ${
          isOpen ? "pl-60" : "pl-16"
        }`}
      > */}
        <h1 className="text-xl font-bold mb-6 flex items-center space-x-3">
          {/* Download Icon (Inline SVG) */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.707 7.48C14.5195 7.28772 14.2652 7.17971 14 7.17971C13.7348 7.17971 13.4805 7.28772 13.293 7.48L11 9.8318V1.02564C11 0.753624 10.8946 0.492748 10.7071 0.300403C10.5196 0.108058 10.2652 0 10 0C9.73478 0 9.48043 0.108058 9.29289 0.300403C9.10536 0.492748 9 0.753624 9 1.02564V9.8318L6.707 7.48C6.61475 7.38204 6.50441 7.30391 6.3824 7.25015C6.2604 7.1964 6.12918 7.16811 5.9964 7.16692C5.86362 7.16574 5.73194 7.19169 5.60905 7.24326C5.48615 7.29483 5.3745 7.37099 5.2806 7.46729C5.18671 7.56359 5.11246 7.6781 5.06218 7.80415C5.0119 7.9302 4.9866 8.06525 4.98775 8.20144C4.9889 8.33762 5.01649 8.47221 5.0689 8.59734C5.12131 8.72247 5.19749 8.83564 5.293 8.93026L9.293 13.0328C9.38589 13.1283 9.49624 13.2041 9.61773 13.2558C9.73922 13.3075 9.86947 13.3341 10.001 13.3341C10.1325 13.3341 10.2628 13.3075 10.3843 13.2558C10.5058 13.2041 10.6161 13.1283 10.709 13.0328L14.709 8.93026C14.8962 8.73765 15.0012 8.47667 15.0008 8.2047C15.0004 7.93274 14.8947 7.67206 14.707 7.48Z"
              fill="#FAFAFA"
            />
            <path
              d="M18 11.7949H15.45L12.475 14.8462C12.15 15.1795 11.7641 15.444 11.3395 15.6244C10.9148 15.8048 10.4597 15.8977 10 15.8977C9.54034 15.8977 9.08519 15.8048 8.66053 15.6244C8.23586 15.444 7.85001 15.1795 7.525 14.8462L4.55 11.7949H2C1.46957 11.7949 0.960859 12.011 0.585786 12.3957C0.210714 12.7804 0 13.3021 0 13.8462V17.9487C0 18.4928 0.210714 19.0145 0.585786 19.3992C0.960859 19.7839 1.46957 20 2 20H18C18.5304 20 19.0391 19.7839 19.4142 19.3992C19.7893 19.0145 20 18.4928 20 17.9487V13.8462C20 13.3021 19.7893 12.7804 19.4142 12.3957C19.0391 12.011 18.5304 11.7949 18 11.7949ZM15.5 17.9487C15.2033 17.9487 14.9133 17.8585 14.6666 17.6894C14.42 17.5204 14.2277 17.2801 14.1142 16.999C14.0007 16.7179 13.9709 16.4086 14.0288 16.1101C14.0867 15.8117 14.2296 15.5376 14.4393 15.3224C14.6491 15.1072 14.9164 14.9607 15.2074 14.9014C15.4983 14.842 15.7999 14.8725 16.074 14.9889C16.3481 15.1053 16.5824 15.3025 16.7472 15.5555C16.912 15.8085 17 16.106 17 16.4103C17 16.8183 16.842 17.2096 16.5607 17.4981C16.2794 17.7866 15.8978 17.9487 15.5 17.9487Z"
              fill="#FAFAFA"
            />
          </svg>
          {/* Heading Text */}
          <span>Content Management System › About Us</span>
        </h1>
        <div className="mx-6">
          <div className="w-full mb-20 bg-neutral-900 mt-6 rounded-lg shadow-lg border-2 border-neutral-600">
            <div className="pb-4 mb-4 w-full flex items-center justify-between">
              <div className="text-lg font-semibold border-b-2 border-neutral-600 w-full mt-5 mb-4 pb-2 flex justify-between text-left">
                <span className="ml-6">
                  About Us (Last Updated at 20-12-24)
                </span>
                <button className="w-[40px] h-[30px] mr-6 mb-2 bg-neutral-700 text-white flex items-center justify-center rounded">
                  <span className="text-2xl pb-2 mb-1">...</span>
                </button>
              </div>
            </div>
            <div className="p-4 md:pl-6 md:pr-6 md:pt-1 space-y-4">
              <div className="w-full bg-neutral-800 mb-10 p-6 rounded-lg shadow-lg border border-neutral-600">
                {isEditing ? (
                  <Editor data={content} onChange={handleEditorChange} />
                ) : content.blocks?.length > 0 ? (
                  <div className="space-y-4">
                    {content.blocks.map(renderBlock)}
                  </div>
                ) : (
                  <p className="text-gray-300">No content available</p>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className={`px-2 w-[70px] h-[48px] text-base font-medium font-inter leading-6 break-words rounded-lg ${
                    isEditing
                      ? "bg-white hover:bg-orange-700 text-black"
                      : "bg-white hover:bg-orange-700 text-black"
                  }`}
                  onClick={() =>
                    isEditing ? saveContentToDatabase() : setIsEditing(true)
                  }
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      </div>
    </>
  );
};
export default Aboutus;
