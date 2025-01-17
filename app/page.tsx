import Pagination from "./components/Pagination";

export default async function Home({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const page = await searchParams;

  return (
    <Pagination
      itemCount={100}
      pageSize={10}
      currentPage={parseInt(page.page)}
    />
  );
}
