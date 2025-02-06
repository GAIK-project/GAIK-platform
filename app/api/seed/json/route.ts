import { openAIembeddings } from "@/ai/middleware/index";
import { db } from "@/lib/db/drizzle/drizzle";
import type { NewHaagaHeliaContent } from "@/lib/db/drizzle/schema";
import { ContentType, haagaHeliaContent } from "@/lib/db/drizzle/schema";
import { haagaHeliaData } from "@/lib/db/mockData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = haagaHeliaData;

    // Process educational content
    for (const course of data.educational_content) {
      const courseText = `${course.title} ${course.description} ${course.content_blocks
        .map((block: any) => `${block.title} ${block.text}`)
        .join(" ")}`;

      const embedding = await openAIembeddings.embedQuery(courseText);

      const newCourse: NewHaagaHeliaContent = {
        type: "COURSE" as ContentType,
        title: course.title,
        description: course.description,
        content: {
          courseId: course.id,
          credits: course.credits,
          campus: course.campus,
          language: course.language,
          teachers: course.teachers,
          keywords: course.keywords,
          contentBlocks: course.content_blocks,
        },
        metadata: {
          credits: course.credits,
          language: course.language,
        },
        embedding,
      };

      await db.insert(haagaHeliaContent).values(newCourse);
    }

    // Process campus information
    for (const campus of data.campus_information) {
      const campusText = `${campus.name} ${campus.address} ${campus.facilities
        .map((f) => `${f.type} ${f.description} ${f.openingHours}`)
        .join(" ")}`;

      const embedding = await openAIembeddings.embedQuery(campusText);

      await db.insert(haagaHeliaContent).values({
        type: "CAMPUS",
        title: campus.name,
        description: campus.address,
        content: {
          facilities: campus.facilities,
        },
        metadata: {
          address: campus.address,
        },
        embedding,
      });
    }

    // Process degree programs
    for (const program of data.degree_programs) {
      const programText = `${program.name} ${program.description} ${program.key_courses.join(" ")}`;

      const embedding = await openAIembeddings.embedQuery(programText);

      await db.insert(haagaHeliaContent).values({
        type: "PROGRAM",
        title: program.name,
        description: program.description,
        content: {
          code: program.code,
          type: program.type,
          duration: program.duration,
          credits: program.credits,
          language: program.language,
          keyCourses: program.key_courses,
        },
        metadata: {
          code: program.code,
          credits: program.credits,
        },
        embedding,
      });
    }

    // Process student services
    for (const service of data.student_services) {
      const serviceText = `${service.service} ${service.location} ${service.services.join(" ")}`;

      const embedding = await openAIembeddings.embedQuery(serviceText);

      await db.insert(haagaHeliaContent).values({
        type: "SERVICE",
        title: service.service,
        description: service.location,
        content: {
          contact: service.contact,
          openingHours: service.opening_hours,
          services: service.services,
        },
        metadata: {
          contact: service.contact,
        },
        embedding,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Data successfully imported and embeddings created",
    });
  } catch (error: unknown) {
    console.error("Error processing data:", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 },
    );
  }
}
