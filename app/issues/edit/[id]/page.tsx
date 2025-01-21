import prisma from "@/prisma/client";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import IssueFormSkeleton from "./loading";

const IssueForm = dynamic(() => import("../../_components/IssueForm"), {
  // ssr: false, // Uncomment this line if you want to disable SSR
  loading: () => <IssueFormSkeleton />,
});

interface Props {
  params: any;
}

const EditIssuePage = async ({ params }: Props) => {
  // Ensure params.id is resolved correctly
  const resolvedParams = await Promise.resolve(params);

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(resolvedParams.id) },
  });

  if (!issue) {
    notFound();
  }

  return <IssueForm issue={issue} />;
};

export default EditIssuePage;
