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
  // Resolve params if it behaves as a Promise
  const resolvedParams = await Promise.resolve(params);

  const session = await getServerSession(authOptions);
  const issue = await fetchUser(parseInt(resolvedParams.id));

  if (!issue) {
    notFound();
  }

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssigneeSelect issue={issue} />
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export async function generateMetadata({ params }: Props) {
  // Resolve params to ensure correct type
  const resolvedParams = await Promise.resolve(params);

  const issue = await fetchUser(parseInt(resolvedParams.id));

  return {
    title: issue?.title || "Issue Details",
    description: issue
      ? `Details of issue ${issue.id}`
      : "Details of the selected issue.",
  };
}

export default IssueDetailPage;
