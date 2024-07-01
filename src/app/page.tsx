import FileTable from "@/components/FileTable";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: {
    dir?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const { dir } = searchParams;

  const [configRes, filesRes] = await Promise.all([
    fetch(`http://localhost:8080/config`, { cache: "no-cache" }),
    fetch(`http://localhost:8080?dir=${dir ?? "/"}`, {
      cache: "no-cache",
    }),
  ]);

  const config = (await configRes.json()) as Config;

  const files = (await filesRes.json()) as SVFile[];

  return (
    <main className="m-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {config.server.name}
        </h1>

        <FileTable files={files} />
      </div>
    </main>
  );
}
