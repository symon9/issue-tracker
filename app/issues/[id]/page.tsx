import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { cache } from "react";
import AssigneeSelect from "./AssigneeSelect";
import DeleteIssueButton from "./DeleteIssueButton";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";

interface Props {
  params: { id: string };
}

const fetchUser = cache((issueId: number) =>
  prisma.issue.findUnique({
    where: { id: issueId },
  })
);

const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const issueId = parseInt(params.id);
  if (isNaN(issueId)) return notFound();

  const issue = await fetchUser(issueId);
  if (!issue) return notFound();

  return (
    <Flex direction="column" gap="3">
      <IssueDetails issue={issue} />
      <AssigneeSelect issue={issue} />
      <EditIssueButton issueId={issue.id} />
      <DeleteIssueButton issueId={issue.id} />
    </Flex>
  );
};

export async function generateMetadata({ params }: Props) {
  const paramsAwaited = await params;
  const issue = await fetchUser(parseInt(paramsAwaited.id));

  return {
    title: issue?.title,
    description: "Details of issue " + issue?.id,
  };
}

export default IssueDetailPage;
