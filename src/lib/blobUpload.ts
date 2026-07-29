export type BlobUploadResult = {
  url: string;
  name: string;
  id: string;
  size?: number;
  fileType?: string;
};

/**
 * Upload file to Vercel Blob via server. Requires login + BLACK_READ_WRITE_TOKEN.
 * Does NOT store the file locally.
 */
export async function uploadToBlob(
  file: File,
  kind: "resume" | "document"
): Promise<BlobUploadResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("kind", kind);

  const res = await fetch("/api/blob/server-upload", {
    method: "POST",
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error ||
        `Upload failed (${res.status}). Are you logged in and is BLACK_READ_WRITE_TOKEN set?`
    );
  }

  return {
    url: data.blob.url as string,
    name: (data.item?.name as string) || file.name,
    id: data.item.id as string,
    size: file.size,
    fileType: file.name.split(".").pop()?.toUpperCase(),
  };
}

/** Public blobs are directly accessible by URL */
export function downloadFromBlob(url: string) {
  window.open(url, "_blank");
}
