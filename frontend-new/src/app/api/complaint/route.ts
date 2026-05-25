import { NextResponse } from "next/server";

const DIRECTUS_URL =
  process.env.API_INTERNAL_URL ||
  process.env.DIRECTUS_URL ||
  process.env.NEXT_PUBLIC_API_URL;

const DIRECTUS_TOKEN =
  process.env.SERVICE_USER_TOKEN ||
  process.env.DIRECTUS_TOKEN ||
  process.env.DIRECTUS_STATIC_TOKEN ||
  process.env.API_TOKEN;

export async function POST(req: Request) {
  if (!DIRECTUS_URL) {
    return NextResponse.json(
      { error: "DIRECTUS_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();

    const recaptcha = String(formData.get("recaptcha") ?? "");

    const payload = Object.fromEntries(
      Array.from(formData.entries()).filter(([key, value]) => {
        return (
          key !== "recaptcha" &&
          key !== "files" &&
          typeof value === "string"
        );
      })
    );

    const files = formData.getAll("files").filter((file): file is File => {
      return file instanceof File;
    });

    const uploadedFileIds = await Promise.all(
      files.map(async (file) => {
        const directusFileData = new FormData();

        directusFileData.append("file", file);

        const uploadResponse = await fetch(`${DIRECTUS_URL}/files`, {
          method: "POST",
          headers: {
            ...(DIRECTUS_TOKEN
              ? {
                  Authorization: `Bearer ${DIRECTUS_TOKEN}`,
                }
              : {}),
          },
          body: directusFileData,
          cache: "no-store",
        });

        const uploadData = await uploadResponse.json().catch(() => ({}));

        if (!uploadResponse.ok || !uploadData?.data?.id) {
          console.error("Directus file upload failed:", uploadData);

          throw new Error("Directus file upload failed");
        }

        return uploadData.data.id as string;
      })
    );

    const payloadWithFiles = {
      ...payload,
      ...(uploadedFileIds.length > 0
        ? {
            files: {
              create: uploadedFileIds.map((fileId) => ({
                directus_files_id: fileId,
              })),
            },
          }
        : {}),
    };

    const response = await fetch(`${DIRECTUS_URL}/items/complaint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(DIRECTUS_TOKEN
          ? {
              Authorization: `Bearer ${DIRECTUS_TOKEN}`,
            }
          : {}),
      },
      body: JSON.stringify(payloadWithFiles),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Directus complaint create failed:", data);

      return NextResponse.json(
        {
          error: "Directus complaint create failed",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data,
      uploadedFileIds,
      recaptchaReceived: Boolean(recaptcha),
    });
  } catch (error) {
    console.error("Complaint API error:", error);

    return NextResponse.json(
      {
        error: "Complaint API error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}