"use client";

import { useState } from "react";
import { FaFile, FaFolder } from "react-icons/fa";
import Modal from "react-modal";

interface Props {
  file: SVFile;
  currentDir: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${size} ${sizes[i]}`;
}

const File = ({ file, currentDir }: Props) => {
  const [stack, setStack] = useState<SVFile[][]>([]);

  const push = (files: SVFile[]) => {
    setStack((prev) => [...prev, files]);
  };
  const pop = () => {
    setStack((prev) => [...prev.slice(0, prev.length - 1)]);
  };

  const handleDir = async (file: string) => {
    const res = await fetch(`http://localhost:8080?dir=${currentDir}/${file}`, {
      cache: "no-cache",
    });

    const files = (await res.json()) as SVFile[];

    push(files);
  };

  const handleOnClick = (file: SVFile) => {
    if (file.is_dir) handleDir(file.name);
  };

  return (
    <div>
      {stack.map((items, index) => (
        <Modal
          key={index}
          isOpen={index === stack.length - 1}
          onRequestClose={pop}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <div className="grid max-h-96 lg:grid-cols-4">
            {items.map((children) => (
              <div key={children.name}>
                <File
                  currentDir={`${currentDir}/${file.name}`}
                  file={children}
                />
              </div>
            ))}
          </div>
        </Modal>
      ))}
      <div
        onDoubleClick={() => handleOnClick(file)}
        key={file.name}
        className="flex items-center gap-2 rounded-md p-2 hover:bg-teal-100"
      >
        {file.is_dir ? (
          <FaFolder size={30} color={"yellow"} />
        ) : (
          <FaFile size={30} color={"blue"} />
        )}
        <p>{file.name}</p>
        {!file.is_dir && (
          <p className="bg-rose-950 text-white pl-2 pr-2 rounded-2xl">
            {formatBytes(file.size)}
          </p>
        )}
      </div>
    </div>
  );
};

export default File;
