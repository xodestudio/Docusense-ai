import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Helper for Auth
const handleAuth = async () => {
  const user = await currentUser();
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user.id };
};

export const ourFileRouter = {
  // 🟢 FREE USER ROUTER (Limit: 16MB config, strictly enforced 10MB on client)
  freeUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        userId: metadata.userId,
        fileUrl: file.ufsUrl,
        fileName: file.name,
      };
    }),

  // 🟣 PRO USER ROUTER (Limit: 32MB config, strictly enforced 25MB on client)
  proUploader: f({ pdf: { maxFileSize: "32MB" } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        userId: metadata.userId,
        fileUrl: file.ufsUrl,
        fileName: file.name,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
