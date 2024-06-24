"use client";
import { FaFile, FaFolder } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import path from "path";
import { useState } from "react";

interface Props {
  files: SVFile[];
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${size} ${sizes[i]}`;
};

const FileTable = ({ files }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tableHeaders = ["Name", "Size", "Type", "Action"];

  const dir = searchParams.get("dir") ?? "/";

  const paths = ["/", ...dir.split("/").slice(1)];

  const handleDoubleClick = async (file: SVFile) => {
    if (file.is_dir) {
      const url = path.join("?dir=", dir, file.name);

      router.push(url);
    }
  };

  const handleBreadCrumbClick = (path: string) => {
    const newPath = `/${paths.slice(1, paths.indexOf(path) + 1).join("/")}`;

    console.log({ newPath, paths, i: paths.indexOf(path) });

    router.push(`/?dir=${newPath}`);
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {dir !== "/" &&
          paths.map((path) => (
            <div key={path} className="flex items-center">
              <span
                onClick={() => handleBreadCrumbClick(path)}
                className="hover:text-teal-100"
              >
                {path}
              </span>
              <IoIosArrowForward className="ml-2" />
            </div>
          ))}
      </div>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {tableHeaders.map((header) => (
              <th key={header} className="border p-2 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.name}
              onDoubleClick={() => handleDoubleClick(file)}
              className="hover:bg-teal-100"
            >
              <td className="border p-2 flex items-center gap-2">
                {file.is_dir ? (
                  <FaFolder size={30} className="text-yellow-300" />
                ) : (
                  <FaFile size={30} className="text-cyan-700" />
                )}
                {file.name}
              </td>
              <td className="border p-2">{formatBytes(file.size)}</td>
              <td className="border p-2">{file.is_dir ? "Folder" : "File"}</td>
              <td className="border">
                {!file.is_dir && <FileDownloadBtn file={file} dir={dir} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FileDownloadBtn = ({ file, dir }: { file: SVFile; dir: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileDownload = async (file: SVFile) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const fullFile = path.join(dir, file.name);

      const res = await fetch(
        `http://localhost:8080/download?file=${fullFile}`,
      );

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = fullFile;

      document.body.appendChild(a);

      a.click();
      a.remove();
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={() => handleFileDownload(file)}
      className="p-2 bg-blue-400 rounded-lg flex justify-self-center"
    >
      {isLoading ? "Downloading..." : "Download"}
    </button>
  );
};

export default FileTable;
