import authOptions from "@/app/auth/authOptions";
import { patchIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Extract the issue ID from the URL
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
    }

    const body = await request.json();
    const validation = patchIssueSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const { assignedToUserId, title, description } = body;

    if (assignedToUserId) {
      const user = await prisma.user.findUnique({
        where: { id: assignedToUserId },
      });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid assigned user ID" },
          { status: 400 }
        );
      }
    }

    const issue = await prisma.issue.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const updatedIssue = await prisma.issue.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        description,
        assignedToUserId,
      },
    });

    return NextResponse.json(updatedIssue, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
