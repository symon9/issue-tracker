import authOptions from "@/app/auth/authOptions";
import { patchIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 301 });

  const body = await request.json();
  const validation = patchIssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const { assignedToUserId, title, description } = body;
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
    });
    if (!user)
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }
  
  const paramsAwaited = await params;
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(paramsAwaited.id) },
  });
  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  const updatedIssue = await prisma.issue.update({
    where: { id: issue.id },
    data: {
      title,
      description,
      assignedToUserId,
    },
  });

  return NextResponse.json(updatedIssue);
}

export async function DELETE(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(authOptions);
  if (!session) return response.status(301).json({});

  const { id } = request.query;
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id as string) },
  });
  if (!issue)
    return response.status(404).json({ error: "Invalid issue" });

  await prisma.issue.delete({
    where: { id: issue.id },
  });

  return response.status(200).json({});
}
