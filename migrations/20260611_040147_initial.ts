import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_products_gallery_category" AS ENUM('exterior', 'interior', 'detail', 'lifestyle');
  CREATE TYPE "public"."enum_products_applicable_states" AS ENUM('NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT');
  CREATE TYPE "public"."enum_products_certifications_type" AS ENUM('structural', 'electrical', 'plumbing', 'fire-safety', 'energy-efficiency', 'other');
  CREATE TYPE "public"."enum_products_option_categories_selection_type" AS ENUM('single', 'multiple');
  CREATE TYPE "public"."enum_products_listing_status" AS ENUM('draft', 'active', 'discontinued');
  CREATE TYPE "public"."enum_products_ncc_classification" AS ENUM('1a', '1b', '2', '3', '10a');
  CREATE TYPE "public"."enum_products_wind_region" AS ENUM('A', 'B', 'C', 'D');
  CREATE TYPE "public"."enum_products_bal_rating" AS ENUM('BAL-LOW', 'BAL-12.5', 'BAL-19', 'BAL-29', 'BAL-40', 'BAL-FZ');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_gallery_category" AS ENUM('exterior', 'interior', 'detail', 'lifestyle');
  CREATE TYPE "public"."enum__products_v_version_applicable_states" AS ENUM('NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT');
  CREATE TYPE "public"."enum__products_v_version_certifications_type" AS ENUM('structural', 'electrical', 'plumbing', 'fire-safety', 'energy-efficiency', 'other');
  CREATE TYPE "public"."enum__products_v_version_option_categories_selection_type" AS ENUM('single', 'multiple');
  CREATE TYPE "public"."enum__products_v_version_ncc_classification" AS ENUM('1a', '1b', '2', '3', '10a');
  CREATE TYPE "public"."enum__products_v_version_wind_region" AS ENUM('A', 'B', 'C', 'D');
  CREATE TYPE "public"."enum__products_v_version_bal_rating" AS ENUM('BAL-LOW', 'BAL-12.5', 'BAL-19', 'BAL-29', 'BAL-40', 'BAL-FZ');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_documents_document_type" AS ENUM('compliance', 'specification', 'brochure', 'other');
  CREATE TYPE "public"."enum_quotes_source" AS ENUM('product-page', 'planner', 'contact', 'general');
  CREATE TYPE "public"."enum_quotes_status" AS ENUM('new', 'pending', 'responded', 'won', 'lost');
  CREATE TYPE "public"."enum_quotes_interest_category" AS ENUM('modular-homes', 'kit-homes', 'container-homes', 'tiny-homes', 'sheds', 'other');
  CREATE TYPE "public"."enum_quotes_delivery_state" AS ENUM('NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT');
  CREATE TYPE "public"."enum_quotes_project_timeline" AS ENUM('immediate', 'short', 'medium', 'long', 'exploring');
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('linkedin', 'facebook', 'instagram');
  CREATE TYPE "public"."enum_site_content_value_props_icon" AS ENUM('factory', 'shield-check', 'piggy-bank', 'building-2', 'clock', 'truck');
  CREATE TYPE "public"."enum_site_content_steps_icon" AS ENUM('message-square', 'pencil-ruler', 'factory', 'truck');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"category" "enum_products_gallery_category"
  );
  
  CREATE TABLE "products_floor_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" varchar
  );
  
  CREATE TABLE "products_applicable_states" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_applicable_states",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"type" "enum_products_certifications_type",
  	"document_id" integer,
  	"issue_date" timestamp(3) with time zone,
  	"expiry_date" timestamp(3) with time zone
  );
  
  CREATE TABLE "products_option_categories_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"price_modifier" numeric
  );
  
  CREATE TABLE "products_option_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category_name" varchar,
  	"selection_type" "enum_products_option_categories_selection_type" DEFAULT 'single'
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"category_id" integer,
  	"excerpt" varchar,
  	"description" varchar,
  	"price_range_from" numeric,
  	"price_range_to" numeric,
  	"price_range_label" varchar,
  	"status" "enum_products_listing_status" DEFAULT 'draft',
  	"hero_image_id" integer,
  	"dimensions_length" numeric,
  	"dimensions_width" numeric,
  	"dimensions_height" numeric,
  	"bedrooms" numeric,
  	"bathrooms" numeric,
  	"floor_area" numeric,
  	"weight" numeric,
  	"structural_system" varchar,
  	"insulation_rating" varchar,
  	"ncc_classification" "enum_products_ncc_classification",
  	"wind_region" "enum_products_wind_region",
  	"bal_rating" "enum_products_bal_rating",
  	"scene_template" jsonb,
  	"template_thumbnail_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_products_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"category" "enum__products_v_version_gallery_category",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_floor_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_applicable_states" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__products_v_version_applicable_states",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_products_v_version_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"type" "enum__products_v_version_certifications_type",
  	"document_id" integer,
  	"issue_date" timestamp(3) with time zone,
  	"expiry_date" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_option_categories_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"price_modifier" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_option_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"category_name" varchar,
  	"selection_type" "enum__products_v_version_option_categories_selection_type" DEFAULT 'single',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_excerpt" varchar,
  	"version_description" varchar,
  	"version_price_range_from" numeric,
  	"version_price_range_to" numeric,
  	"version_price_range_label" varchar,
  	"version_status" "enum_products_listing_status" DEFAULT 'draft',
  	"version_hero_image_id" integer,
  	"version_dimensions_length" numeric,
  	"version_dimensions_width" numeric,
  	"version_dimensions_height" numeric,
  	"version_bedrooms" numeric,
  	"version_bathrooms" numeric,
  	"version_floor_area" numeric,
  	"version_weight" numeric,
  	"version_structural_system" varchar,
  	"version_insulation_rating" varchar,
  	"version_ncc_classification" "enum__products_v_version_ncc_classification",
  	"version_wind_region" "enum__products_v_version_wind_region",
  	"version_bal_rating" "enum__products_v_version_bal_rating",
  	"version_scene_template" jsonb,
  	"version_template_thumbnail_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"document_type" "enum_documents_document_type",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "quotes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference_number" varchar NOT NULL,
  	"source" "enum_quotes_source" DEFAULT 'product-page',
  	"status" "enum_quotes_status" DEFAULT 'new',
  	"product_id" integer,
  	"product_title" varchar,
  	"product_slug" varchar,
  	"selected_options" jsonb,
  	"layout_data" jsonb,
  	"layout_screenshot_id" integer,
  	"interest_category" "enum_quotes_interest_category",
  	"contact_name" varchar NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"contact_phone" varchar,
  	"company" varchar,
  	"quantity" numeric DEFAULT 1,
  	"delivery_state" "enum_quotes_delivery_state",
  	"delivery_location" varchar,
  	"project_timeline" "enum_quotes_project_timeline",
  	"site_conditions" varchar,
  	"is_estate_inquiry" boolean DEFAULT false,
  	"number_of_units" numeric,
  	"site_address" varchar,
  	"model_mix" jsonb,
  	"additional_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "project_gallery_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "project_gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"location" varchar,
  	"description" varchar,
  	"completion_date" timestamp(3) with time zone,
  	"hero_image_id" integer,
  	"product_id" integer,
  	"developer" varchar,
  	"number_of_units" numeric,
  	"testimonial" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"media_id" integer,
  	"documents_id" integer,
  	"quotes_id" integer,
  	"project_gallery_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone" varchar DEFAULT '1300 KWIKBUILT',
  	"email" varchar DEFAULT 'info@kwikbuilthomes.com.au',
  	"location" varchar DEFAULT 'Port Macquarie, NSW, Australia',
  	"company_name" varchar DEFAULT 'KwikBuilt Pty Ltd',
  	"tagline" varchar DEFAULT 'Australian-engineered modular homes',
  	"abn" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_content_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "site_content_value_props" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" "enum_site_content_value_props_icon"
  );
  
  CREATE TABLE "site_content_leadership" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "site_content_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" "enum_site_content_steps_icon"
  );
  
  CREATE TABLE "site_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_headline" varchar DEFAULT 'Australian-Engineered Modular Homes',
  	"hero_tagline" varchar DEFAULT 'Factory-built. Site-ready. NCC-compliant.',
  	"hero_primary_cta" varchar DEFAULT 'Browse Our Range',
  	"hero_secondary_cta" varchar DEFAULT 'Request a Quote',
  	"hero_video_id" integer,
  	"hero_poster_id" integer,
  	"about_summary" varchar DEFAULT 'KwikBuilt is an Australian modular home distributor delivering factory-built, site-ready buildings through international manufacturing partnerships. We supply land developers, builders, and sub-distributors across Australia.',
  	"cta_banner_heading" varchar DEFAULT 'Ready to start your project?',
  	"cta_banner_button_text" varchar DEFAULT 'Request a Quote',
  	"company_story" varchar DEFAULT 'KwikBuilt Pty Ltd is an Australian modular home distributor. Our factory-built modules are engineered to Australian standards, manufactured through international partnerships, and delivered site-ready across Australia.',
  	"dealership_model" varchar DEFAULT 'KwikBuilt supplies to land developers, builders, and sub-distributors. Our dealership partners handle installation and final fitout, ensuring local expertise at every stage.',
  	"why_modular" varchar DEFAULT 'Modular construction delivers faster build times, consistent factory quality control, predictable pricing, and the scalability to support housing estates and developments of any size.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_floor_plans" ADD CONSTRAINT "products_floor_plans_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_floor_plans" ADD CONSTRAINT "products_floor_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_applicable_states" ADD CONSTRAINT "products_applicable_states_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_certifications" ADD CONSTRAINT "products_certifications_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_certifications" ADD CONSTRAINT "products_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_option_categories_options" ADD CONSTRAINT "products_option_categories_options_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_option_categories_options" ADD CONSTRAINT "products_option_categories_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_option_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_option_categories" ADD CONSTRAINT "products_option_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_template_thumbnail_id_media_id_fk" FOREIGN KEY ("template_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_floor_plans" ADD CONSTRAINT "_products_v_version_floor_plans_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_floor_plans" ADD CONSTRAINT "_products_v_version_floor_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_applicable_states" ADD CONSTRAINT "_products_v_version_applicable_states_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_certifications" ADD CONSTRAINT "_products_v_version_certifications_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_certifications" ADD CONSTRAINT "_products_v_version_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_option_categories_options" ADD CONSTRAINT "_products_v_version_option_categories_options_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_option_categories_options" ADD CONSTRAINT "_products_v_version_option_categories_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_option_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_option_categories" ADD CONSTRAINT "_products_v_version_option_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_template_thumbnail_id_media_id_fk" FOREIGN KEY ("version_template_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quotes" ADD CONSTRAINT "quotes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quotes" ADD CONSTRAINT "quotes_layout_screenshot_id_media_id_fk" FOREIGN KEY ("layout_screenshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_gallery_gallery" ADD CONSTRAINT "project_gallery_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_gallery_gallery" ADD CONSTRAINT "project_gallery_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_gallery" ADD CONSTRAINT "project_gallery_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_gallery" ADD CONSTRAINT "project_gallery_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quotes_fk" FOREIGN KEY ("quotes_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_gallery_fk" FOREIGN KEY ("project_gallery_id") REFERENCES "public"."project_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_stats" ADD CONSTRAINT "site_content_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_value_props" ADD CONSTRAINT "site_content_value_props_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_leadership" ADD CONSTRAINT "site_content_leadership_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_steps" ADD CONSTRAINT "site_content_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content" ADD CONSTRAINT "site_content_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_content" ADD CONSTRAINT "site_content_hero_poster_id_media_id_fk" FOREIGN KEY ("hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "products_gallery_order_idx" ON "products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_image_idx" ON "products_gallery" USING btree ("image_id");
  CREATE INDEX "products_floor_plans_order_idx" ON "products_floor_plans" USING btree ("_order");
  CREATE INDEX "products_floor_plans_parent_id_idx" ON "products_floor_plans" USING btree ("_parent_id");
  CREATE INDEX "products_floor_plans_image_idx" ON "products_floor_plans" USING btree ("image_id");
  CREATE INDEX "products_applicable_states_order_idx" ON "products_applicable_states" USING btree ("order");
  CREATE INDEX "products_applicable_states_parent_idx" ON "products_applicable_states" USING btree ("parent_id");
  CREATE INDEX "products_certifications_order_idx" ON "products_certifications" USING btree ("_order");
  CREATE INDEX "products_certifications_parent_id_idx" ON "products_certifications" USING btree ("_parent_id");
  CREATE INDEX "products_certifications_document_idx" ON "products_certifications" USING btree ("document_id");
  CREATE INDEX "products_option_categories_options_order_idx" ON "products_option_categories_options" USING btree ("_order");
  CREATE INDEX "products_option_categories_options_parent_id_idx" ON "products_option_categories_options" USING btree ("_parent_id");
  CREATE INDEX "products_option_categories_options_image_idx" ON "products_option_categories_options" USING btree ("image_id");
  CREATE INDEX "products_option_categories_order_idx" ON "products_option_categories" USING btree ("_order");
  CREATE INDEX "products_option_categories_parent_id_idx" ON "products_option_categories" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_hero_image_idx" ON "products" USING btree ("hero_image_id");
  CREATE INDEX "products_template_thumbnail_idx" ON "products" USING btree ("template_thumbnail_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "_products_v_version_gallery_order_idx" ON "_products_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_products_v_version_gallery_parent_id_idx" ON "_products_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_gallery_image_idx" ON "_products_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_products_v_version_floor_plans_order_idx" ON "_products_v_version_floor_plans" USING btree ("_order");
  CREATE INDEX "_products_v_version_floor_plans_parent_id_idx" ON "_products_v_version_floor_plans" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_floor_plans_image_idx" ON "_products_v_version_floor_plans" USING btree ("image_id");
  CREATE INDEX "_products_v_version_applicable_states_order_idx" ON "_products_v_version_applicable_states" USING btree ("order");
  CREATE INDEX "_products_v_version_applicable_states_parent_idx" ON "_products_v_version_applicable_states" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_certifications_order_idx" ON "_products_v_version_certifications" USING btree ("_order");
  CREATE INDEX "_products_v_version_certifications_parent_id_idx" ON "_products_v_version_certifications" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_certifications_document_idx" ON "_products_v_version_certifications" USING btree ("document_id");
  CREATE INDEX "_products_v_version_option_categories_options_order_idx" ON "_products_v_version_option_categories_options" USING btree ("_order");
  CREATE INDEX "_products_v_version_option_categories_options_parent_id_idx" ON "_products_v_version_option_categories_options" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_option_categories_options_image_idx" ON "_products_v_version_option_categories_options" USING btree ("image_id");
  CREATE INDEX "_products_v_version_option_categories_order_idx" ON "_products_v_version_option_categories" USING btree ("_order");
  CREATE INDEX "_products_v_version_option_categories_parent_id_idx" ON "_products_v_version_option_categories" USING btree ("_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_category_idx" ON "_products_v" USING btree ("version_category_id");
  CREATE INDEX "_products_v_version_version_hero_image_idx" ON "_products_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_products_v_version_version_template_thumbnail_idx" ON "_products_v" USING btree ("version_template_thumbnail_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE UNIQUE INDEX "quotes_reference_number_idx" ON "quotes" USING btree ("reference_number");
  CREATE INDEX "quotes_product_idx" ON "quotes" USING btree ("product_id");
  CREATE INDEX "quotes_layout_screenshot_idx" ON "quotes" USING btree ("layout_screenshot_id");
  CREATE INDEX "quotes_updated_at_idx" ON "quotes" USING btree ("updated_at");
  CREATE INDEX "quotes_created_at_idx" ON "quotes" USING btree ("created_at");
  CREATE INDEX "project_gallery_gallery_order_idx" ON "project_gallery_gallery" USING btree ("_order");
  CREATE INDEX "project_gallery_gallery_parent_id_idx" ON "project_gallery_gallery" USING btree ("_parent_id");
  CREATE INDEX "project_gallery_gallery_image_idx" ON "project_gallery_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "project_gallery_slug_idx" ON "project_gallery" USING btree ("slug");
  CREATE INDEX "project_gallery_hero_image_idx" ON "project_gallery" USING btree ("hero_image_id");
  CREATE INDEX "project_gallery_product_idx" ON "project_gallery" USING btree ("product_id");
  CREATE INDEX "project_gallery_updated_at_idx" ON "project_gallery" USING btree ("updated_at");
  CREATE INDEX "project_gallery_created_at_idx" ON "project_gallery" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_quotes_id_idx" ON "payload_locked_documents_rels" USING btree ("quotes_id");
  CREATE INDEX "payload_locked_documents_rels_project_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("project_gallery_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_content_stats_order_idx" ON "site_content_stats" USING btree ("_order");
  CREATE INDEX "site_content_stats_parent_id_idx" ON "site_content_stats" USING btree ("_parent_id");
  CREATE INDEX "site_content_value_props_order_idx" ON "site_content_value_props" USING btree ("_order");
  CREATE INDEX "site_content_value_props_parent_id_idx" ON "site_content_value_props" USING btree ("_parent_id");
  CREATE INDEX "site_content_leadership_order_idx" ON "site_content_leadership" USING btree ("_order");
  CREATE INDEX "site_content_leadership_parent_id_idx" ON "site_content_leadership" USING btree ("_parent_id");
  CREATE INDEX "site_content_steps_order_idx" ON "site_content_steps" USING btree ("_order");
  CREATE INDEX "site_content_steps_parent_id_idx" ON "site_content_steps" USING btree ("_parent_id");
  CREATE INDEX "site_content_hero_video_idx" ON "site_content" USING btree ("hero_video_id");
  CREATE INDEX "site_content_hero_poster_idx" ON "site_content" USING btree ("hero_poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "products_gallery" CASCADE;
  DROP TABLE "products_floor_plans" CASCADE;
  DROP TABLE "products_applicable_states" CASCADE;
  DROP TABLE "products_certifications" CASCADE;
  DROP TABLE "products_option_categories_options" CASCADE;
  DROP TABLE "products_option_categories" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "_products_v_version_gallery" CASCADE;
  DROP TABLE "_products_v_version_floor_plans" CASCADE;
  DROP TABLE "_products_v_version_applicable_states" CASCADE;
  DROP TABLE "_products_v_version_certifications" CASCADE;
  DROP TABLE "_products_v_version_option_categories_options" CASCADE;
  DROP TABLE "_products_v_version_option_categories" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "quotes" CASCADE;
  DROP TABLE "project_gallery_gallery" CASCADE;
  DROP TABLE "project_gallery" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_content_stats" CASCADE;
  DROP TABLE "site_content_value_props" CASCADE;
  DROP TABLE "site_content_leadership" CASCADE;
  DROP TABLE "site_content_steps" CASCADE;
  DROP TABLE "site_content" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_products_gallery_category";
  DROP TYPE "public"."enum_products_applicable_states";
  DROP TYPE "public"."enum_products_certifications_type";
  DROP TYPE "public"."enum_products_option_categories_selection_type";
  DROP TYPE "public"."enum_products_listing_status";
  DROP TYPE "public"."enum_products_ncc_classification";
  DROP TYPE "public"."enum_products_wind_region";
  DROP TYPE "public"."enum_products_bal_rating";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_gallery_category";
  DROP TYPE "public"."enum__products_v_version_applicable_states";
  DROP TYPE "public"."enum__products_v_version_certifications_type";
  DROP TYPE "public"."enum__products_v_version_option_categories_selection_type";
  DROP TYPE "public"."enum__products_v_version_ncc_classification";
  DROP TYPE "public"."enum__products_v_version_wind_region";
  DROP TYPE "public"."enum__products_v_version_bal_rating";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum_documents_document_type";
  DROP TYPE "public"."enum_quotes_source";
  DROP TYPE "public"."enum_quotes_status";
  DROP TYPE "public"."enum_quotes_interest_category";
  DROP TYPE "public"."enum_quotes_delivery_state";
  DROP TYPE "public"."enum_quotes_project_timeline";
  DROP TYPE "public"."enum_site_settings_social_links_platform";
  DROP TYPE "public"."enum_site_content_value_props_icon";
  DROP TYPE "public"."enum_site_content_steps_icon";`)
}
