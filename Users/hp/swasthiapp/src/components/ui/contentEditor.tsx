"use client";
import React, { useEffect, useRef, useState } from "react";
import EditorJS, { OutputBlockData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";

// Define types for Editor data and onChange
interface BlockData {
  type: "header" | "paragraph" | "list";
  data: {
    text?: string;
    level?: number;
    style?: string;
    items?: string[];
  };
}

interface EditorProps {
  data?: {
    time?: number;
    blocks: BlockData[];
  };
  onChange?: (data: { time: number; blocks: BlockData[] }) => void;
}

const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    { type: "header", data: { text: "Header text", level: 1 } },
    { type: "paragraph", data: { text: "Paragraph text" } },
    {
      type: "list",
      data: {
        style: "ordered",
        items: ["Sample Item 1", "Sample Item 2"],
      },
    },
  ],
};

const mapOutputBlockData = (outputBlock: OutputBlockData<string, any>): BlockData => {
  switch (outputBlock.type) {
    case "header":
      return {
        type: "header",
        data: { text: outputBlock.data.text, level: outputBlock.data.level },
      };
    case "paragraph":
      return {
        type: "paragraph",
        data: { text: outputBlock.data.text },
      };
    case "list":
      return {
        type: "list",
        data: {
          style: outputBlock.data.style,
          items: outputBlock.data.items,
        },
      };
    default:
      return { type: "paragraph", data: { text: "" } };
  }
};

const Editor: React.FC<EditorProps> = ({ data = DEFAULT_INITIAL_DATA, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!isMounted || !onChange || editorRef.current) return;

    editorRef.current = new EditorJS({
      holder: "editorjs",
      tools: {
        header: Header,
        list: List,
      },
      data,
      async onChange(api) {
        const updatedData = await api.saver.save();
        const mappedBlocks = updatedData.blocks.map(mapOutputBlockData);

        const finalData = {
          ...updatedData,
          blocks: mappedBlocks,
          time: updatedData.time ?? new Date().getTime(),
        };

        onChange(finalData);
      },
    });

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [isMounted]); // Only run on mount

  return (
    <div id="editorjs" className="max-w-full bg-neutral" />
  );
};

export default Editor;


