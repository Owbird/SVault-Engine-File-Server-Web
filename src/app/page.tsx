import FileTable from "@/components/FileTable";
import UploadFilesButton from "@/components/UploadFilesButton";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: {
    dir?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const { dir } = searchParams;

  const currentDir = dir ?? "/";

  const [configRes, filesRes] = await Promise.all([
    fetch(`http://localhost:8080/config`, { cache: "no-cache" }),
    fetch(`http://localhost:8080?dir=${currentDir}`, {
      cache: "no-cache",
    }),
  ]);

  const config = (await configRes.json()) as Config;

  const files = (await filesRes.json()) as SVFile[];

  return (
    <main className="m-4">
      <div className="flex flex-col">
        <div className="flex justify-center gap-8">
          <h1 className="text-3xl font-bold mb-4 text-center">
            {config.name}
          </h1>

          {config.allowuploads && (
            <UploadFilesButton currentDir={currentDir} />
          )}
        </div>
        <FileTable files={files} />
      </div>
    </main>
  );
}
