import { FaFile, FaFolder } from "react-icons/fa";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${size} ${sizes[i]}`;
}

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
            <div
              key={file.name}
              className="flex items-center gap-2 rounded-md p-2 hover:bg-teal-100"
            >
              {file.is_dir ? (
                <FaFolder size={30} color={"yellow"} />
              ) : (
                <FaFile size={30} color={"blue"} />
              )}
              <p>{file.name}</p>
              { !file.is_dir &&
                <p className="bg-rose-950 text-white pl-2 pr-2 rounded-2xl">
                  {formatBytes(file.size)}
                </p>
              }
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
