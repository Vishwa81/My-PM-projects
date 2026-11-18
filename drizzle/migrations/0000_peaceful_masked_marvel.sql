CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"cuisine" varchar(255) NOT NULL,
	"address" text,
	"image_url" text,
	"price_range" varchar(50) DEFAULT '₹₹',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(255),
	"comment" text NOT NULL,
	"status" varchar(50) DEFAULT 'published' NOT NULL,
	"helpful_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rating_range_check" CHECK ("reviews"."rating" >= 1 AND "reviews"."rating" <= 5)
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "restaurant_id_idx" ON "reviews" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "customer_id_idx" ON "reviews" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "rating_idx" ON "reviews" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "reviews" USING btree ("created_at");