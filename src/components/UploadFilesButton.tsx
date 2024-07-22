"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import Modal from "react-modal";
import clsx from "clsx";
import { useRouter } from "next/navigation";

interface Props {
  currentDir: string;
}

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "2rem",
    borderRadius: "0.5rem",
  },
};

const UploadFilesButton = ({ currentDir }: Props) => {
  const [openDropModal, setOpenDropModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const toggleDropModal = () => {
    if (isUploading) return;

    setOpenDropModal(!openDropModal);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const formData = new FormData();

    for (let file of acceptedFiles) {
      formData.append("file", file);
    }

    formData.append("uploadDir", currentDir);

    setOpenDropModal(false);

    setIsUploading(true);

    await fetch("http://localhost:8080/upload", {
      mode: "no-cors",
      method: "POST",
      body: formData,
    });

    router.refresh();

    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={toggleDropModal}
        className={clsx(
          "p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300",
          isUploading && "cursor-not-allowed bg-gray-400 hover:bg-gray-500",
        )}
      >
        {!isUploading ? "Upload files here" : "Uploading"}
      </button>

      <Modal
        isOpen={openDropModal}
        onRequestClose={toggleDropModal}
        style={modalStyle}
        contentLabel="Upload Modal"
        ariaHideApp={false}
      >
        <div
          {...getRootProps()}
          className={clsx(
            "border-2 border-dashed rounded-lg p-6 flex justify-center items-center cursor-pointer",
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
          )}
        >
          <input {...getInputProps()} className="hidden" />
          {isDragActive ? (
            <p className="text-blue-500">Drop the files here ...</p>
          ) : (
            <p className="text-gray-500">
              Drag &apos;n&apos; drop some files here, or click to select files
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UploadFilesButton;
