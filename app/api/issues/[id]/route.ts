import authOptions from "@/app/auth/authOptions";
import { patchIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  // Extract the `id` from the URL path
  const urlParts = request.nextUrl.pathname.split('/');
  const id = urlParts[urlParts.length - 1];
  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json({ error: 'Invalid issue ID' }, { status: 400 });
  }

  try {
    const { title, description, assignedToUserId } = await request.json();

    if (!title || !description || !assignedToUserId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
    });
    if (!user) {
      return NextResponse.json({ error: 'Invalid assigned user ID' }, { status: 400 });
    }

    // Check if the issue exists
    const issue = await prisma.issue.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const updatedIssue = await prisma.issue.update({
      where: { id: issue.id },
      data: {
        title,
        description,
        assignedToUserId,
      },
    });

    return NextResponse.json(updatedIssue, { status: 200 });
  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 301 });

  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

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
