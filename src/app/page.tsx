import File from "@/components/File";
import { FaFile, FaFolder } from "react-icons/fa";

export const dynamic = "force-dynamic";

export default async function Home() {
  const res = await fetch(`http://localhost:8080/`, { cache: "no-cache" });

  const files = (await res.json()) as SVFile[];

  return (
    <main className="">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">SVault File Server</h1>

        <div className="grid lg:grid-cols-4 m-4">
          {files.map((file) => (
            <File currentDir="/" key={file.name} file={file} />
          ))}
        </div>
      </div>
    </main>
  );
}
