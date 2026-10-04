const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;
const FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER as string;

type ResourceType = "image" | "auto";

async function upload(file: File, resourceType: ResourceType): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (FOLDER) {
    formData.append("folder", FOLDER);
    formData.append("asset_folder", FOLDER);
  }

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}

export function uploadImageToCloudinary(file: File) {
  return upload(file, "image");
}

/** For PDFs, datasets, archives etc. Cloudinary detects the resource type. */
export function uploadFileToCloudinary(file: File) {
  return upload(file, "auto");
}
