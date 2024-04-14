import { createJob, getAllJobs } from "@/lib/actions/jobs";
import { currentUser } from "@/lib/auth";
import { createJobSchema } from "@/lib/schemas";
import { JobsQuery } from "@/types";
import { JOB_STATUS, JOB_TYPE } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
) {
  const params = req.nextUrl.searchParams;
  const location = params.get("location");
  const type = params.get("type") as JOB_TYPE;
  const status = params.get("status") as JOB_STATUS;
  const skip = params.get("skip") ? parseInt(params.get("skip") as string) : 0;
  const take = params.get("take") ? parseInt(params.get("take") as string) : 10;

  const query: JobsQuery = {
    location: location ?? undefined,
    type: type ? type : "FullTime",
    status: status ? status : "Active"
  };
  
  const jobs = await getAllJobs(query, skip, take);
  if (!jobs) {
    return NextResponse.json({ error: "Failed fetching jobs" }, { status: 500 });
  }

  return NextResponse.json(jobs, { status: 200 });
}

export async function POST(
  req: NextRequest,
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validateed = createJobSchema.safeParse(body);
    if (!validateed.success) {
      return NextResponse.json({ error: validateed.error.errors }, { status: 400 });
    }

    const job = await createJob(body, user.id);
    if (!job) {
      return NextResponse.json({ error: "Failed creating job" }, { status: 500 });
    }
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed creating job" }, { status: 500 });
  }
}
