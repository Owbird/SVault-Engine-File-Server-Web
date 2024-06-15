import FileTable from "@/components/FileTable";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: {
    dir?: string;
    file?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const { file, dir } = searchParams;

  const res = await fetch(`http://localhost:8080?dir=${dir ?? "/"}`, {
    cache: "no-cache",
  });

  const files = (await res.json()) as SVFile[];

  return (
    <main className="m-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-4 text-center">
          SVault File Server
        </h1>

        <FileTable files={files} />
      </div>
    </main>
  );
}
