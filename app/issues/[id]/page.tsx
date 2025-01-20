const IssueDetailPage = async ({ params }: any) => {
  const resolvedParams = await Promise.resolve(params); // Force resolution
  console.log("Resolved Params:", resolvedParams);
  return <div>{resolvedParams.id}</div>;
};

export default IssueDetailPage;