import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import IssueActions from "./IssueActions";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<IssueQuery>;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const { status, orderBy, page } = resolvedSearchParams;

  const statuses = Object.values(Status);
  const validStatus = statuses.includes(status as Status) ? status : undefined;

  const where = { status: validStatus };

  const orderByClause =
    orderBy && columnNames.includes(orderBy)
      ? { [orderBy]: "asc" }
      : undefined;

  const currentPage = parseInt(page) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy: orderByClause,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable searchP={resolvedSearchParams} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={currentPage}
        itemCount={issueCount}
      />
    </Flex>
  );
};

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues",
};

export default IssuesPage;
