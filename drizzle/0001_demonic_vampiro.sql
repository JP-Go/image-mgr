DO $$ BEGIN
 CREATE TYPE "public"."image_upload_status" AS ENUM('pending', 'success', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"image_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"hash" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"external_identity" varchar(255) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "images_hash_unique" UNIQUE("hash"),
	CONSTRAINT "images_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image_uploads" (
	"image_upload_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_id" uuid,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone NOT NULL,
	"upload_status" "image_upload_status" NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_uploads" ADD CONSTRAINT "image_uploads_image_id_images_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("image_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image_uploads" ADD CONSTRAINT "image_uploads_uploaded_by_users_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
