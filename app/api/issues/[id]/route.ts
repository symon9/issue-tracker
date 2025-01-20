import authOptions from "@/app/auth/authOptions";
import { patchIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.redirect('/login');

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  const { title, description, assignedToUserId } = await request.json();

  const user = await prisma.user.findUnique({
    where: { id: assignedToUserId },
  });
  if (!user) return NextResponse.json({ error: "Invalid user" }, { status: 400 });

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });
  if (!issue) return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

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

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.redirect('/login');

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });
  if (!issue) return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  await prisma.issue.delete({
    where: { id: issue.id },
  });

  return NextResponse.json({}, { status: 200 });
}