# BlackfoxAI – Vercel Blob Public Store Fix

## What changed

1. **`src/app/api/blob/server-upload/route.ts`**
   - `access: "private"` → `access: "public"`
   - Token lookup now prefers `BLACK_READ_WRITE_TOKEN` (your new store prefix)

2. **`src/app/api/blob/download/route.ts`**
   - Token lookup prefers `BLACK_READ_WRITE_TOKEN`
   - Uses `access: "public"` for get()

3. **`src/lib/blobUpload.ts`**
   - `downloadFromBlob` opens the public URL directly

## How to apply

Copy these files into your repo (overwrite the existing ones):

```
src/app/api/blob/server-upload/route.ts
src/app/api/blob/download/route.ts
src/lib/blobUpload.ts
```

## Env vars (Vercel + local)

From your new public store `blackfox-blob`:

```
BLACK_READ_WRITE_TOKEN=vercel_blob_rw_...
BLACK_STORE_ID=store_qt1Kkwsp4JEYMWfv
```

Add them in Vercel → Project → Settings → Environment Variables
(for Production and Preview), then redeploy.

Locally, put them in `.env` / `.env.local`.

## After deploy

Upload a document again — the "access must be public" error should be gone.
