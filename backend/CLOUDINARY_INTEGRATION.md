# Cloudinary Integration Guide

## 1. Background

To support remote image hosting and avoid storing binary blobs directly in MongoDB, the project now uses Cloudinary for product image upload and URL management. This integration:

- uploads valid images directly from client requests to Cloudinary
- stores secure Cloudinary image URLs in `product.images`
- provides media transformation out of the box

## 2. New dependencies

Updated `backend/package.json`:

- `cloudinary` `^1.41.3`
- `multer-storage-cloudinary` `^4.0.0`

Existing imaging middleware dependency:

- `multer` `^2.1.1`

## 3. Environment variables

In `backend/.env`, add/confirm:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

The config module throws a startup error when any value is missing.

## 4. Config module: `src/config/cloudinary.js`

Responsibilities:

- load Cloudinary credentials from environment
- enforce required variable presence
- configure Cloudinary client with `secure: true`
- export the configured `cloudinary` instance

Key behavior:

- fails fast if configuration is incomplete
- centralizes Cloudinary client settings for reuse

## 5. Image upload middleware: `src/middleware/upload.js`

Implementation details:

- `CloudinaryStorage` is configured with:
  - `folder: "daraja-market/products"`
  - 1200x1200 limit transform
  - format based on mimetype fallback to `jpg`
  - `public_id` using timestamp plus original base name (uniqueness)
- `imageFileFilter` allows only:
  - `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- `multer()` options:
  - `fileSize: 5MB`
  - `files: 5`
- exposed middleware:
  - `uploadProductImages` (array field `images`, max 5)
  - `attachUploadedImagesToBody` (maps Cloudinary result URL to `req.body.images`)

`attachUploadedImagesToBody` behavior:

- takes upload result URLs from `req.files[].path` / `secure_url` / `url`
- appends them to existing `req.body.images` when present
- ensures downstream validation/controller sees uploaded image URLs

## 6. Model update: `src/models/productModel.js`

`images: [String]` exists as array of image URLs. Product creation/update flows now persist Cloudinary URLs to this field.

## 7. Route injection: `src/routes/productRoutes.js`

`POST /api/products` and `PUT /api/products/:productId` updated to include:

- `uploadProductImages`
- `attachUploadedImagesToBody`

The order is critical:

1. auth/authorization
2. file upload
3. request body adaptation
4. validation
5. controller logic

## 8. Controller path: `src/controllers/productController.js`

No special Cloudinary logic here (upload handling is fully middleware), but controllers now receive `req.body.images` with inserted remote URLs.

## 9. Validation

`productValidationRules` now validates `images` in incoming request body as a URL list (existing rules already handle this), enabling clean schema insertion.

## 10. Testing checklist

1. Confirm env vars exist (`CLOUDINARY_*`)
2. `npm run dev` starts successfully
3. Upload product with valid images:
   - `POST /api/products` form-data `images` (multiple) + product fields
   - verify response contains image URLs from Cloudinary
4. Update product with additional images:
   - `PUT /api/products/:id`
   - verify product keeps existing images and appends new ones
5. Invalid mime type block:
   - send `.txt` file
   - expect error from `imageFileFilter`
6. Oversized files (>5MB) or >5 files block by Multer config

## 11. Impact summary

Benefits:

- reduces payload/storage in DB (only URLs)
- fast content delivery via CDN
- automatic image transformations for consistency
- safer upload pipeline with explicit file filtering and size limits

Potential further improvements:

- delete Cloudinary assets on product deletion
- store public IDs in DB for direct resource management
- add rollback path to remove failed `createProduct` partial updates
- implement signed upload presets for client direct upload (optional)
