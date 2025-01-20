interface Props {
  params: { id: string };
}

const IssueDetailPage = ({ params }: Props) => {
  console.log("Params:", params);
  return <div>{params.id}</div>;
};

export default IssueDetailPage;