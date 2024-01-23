-- CreateTable
CREATE TABLE "ShopifyAccount" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopId" TEXT NOT NULL,
    "myShopifyDomain" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "firstImportEndedAt" TIMESTAMP(3),
    "hasRegisteredWebhooks" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ShopifyAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopifyOrder" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "accountId" TEXT NOT NULL,
    "name" TEXT,
    "note" TEXT,
    "tags" TEXT,
    "test" BOOLEAN,
    "email" TEXT,
    "phone" TEXT,
    "token" TEXT,
    "app_id" TEXT,
    "number" INTEGER,
    "gateway" TEXT,
    "refunds" JSONB[],
    "user_id" TEXT,
    "currency" TEXT,
    "customer" JSONB,
    "shop_url" TEXT,
    "closed_at" TEXT,
    "confirmed" BOOLEAN,
    "device_id" TEXT,
    "reference" TEXT,
    "tax_lines" JSONB[],
    "total_tax" DOUBLE PRECISION,
    "browser_ip" TEXT,
    "cart_token" TEXT,
    "line_items" JSONB[],
    "source_url" TEXT,
    "checkout_id" TEXT,
    "location_id" TEXT,
    "source_name" TEXT,
    "total_price" DOUBLE PRECISION,
    "cancelled_at" TEXT,
    "fulfillments" JSONB[],
    "landing_site" TEXT,
    "order_number" INTEGER,
    "processed_at" TEXT,
    "total_weight" INTEGER,
    "cancel_reason" TEXT,
    "contact_email" TEXT,
    "total_tax_set" JSONB,
    "checkout_token" TEXT,
    "client_details" JSONB,
    "discount_codes" JSONB[],
    "referring_site" TEXT,
    "shipping_lines" JSONB[],
    "subtotal_price" DOUBLE PRECISION,
    "taxes_included" BOOLEAN,
    "billing_address" JSONB,
    "customer_locale" TEXT,
    "note_attributes" JSONB[],
    "payment_details" JSONB,
    "total_discounts" DOUBLE PRECISION,
    "total_price_set" JSONB,
    "total_price_usd" DOUBLE PRECISION,
    "financial_status" TEXT,
    "landing_site_ref" TEXT,
    "order_status_url" TEXT,
    "shipping_address" JSONB,
    "current_total_tax" DOUBLE PRECISION,
    "processing_method" TEXT,
    "source_identifier" TEXT,
    "total_outstanding" DOUBLE PRECISION,
    "fulfillment_status" TEXT,
    "subtotal_price_set" JSONB,
    "total_tip_received" DOUBLE PRECISION,
    "current_total_price" DOUBLE PRECISION,
    "total_discounts_set" JSONB,
    "admin_graphql_api_id" TEXT,
    "discount_allocations" JSONB[],
    "presentment_currency" TEXT,
    "current_total_tax_set" JSONB,
    "payment_gateway_names" TEXT[],
    "current_subtotal_price" DOUBLE PRECISION,
    "total_line_items_price" DOUBLE PRECISION,
    "buyer_accepts_marketing" BOOLEAN,
    "current_total_discounts" DOUBLE PRECISION,
    "current_total_price_set" JSONB,
    "current_total_duties_set" TEXT,
    "total_shipping_price_set" JSONB,
    "original_total_duties_set" TEXT,
    "current_subtotal_price_set" JSONB,
    "total_line_items_price_set" JSONB,
    "current_total_discounts_set" JSONB,
    "account_id" TEXT NOT NULL,

    CONSTRAINT "ShopifyOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopifyProduct" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "accountId" TEXT NOT NULL,
    "tags" TEXT,
    "image" JSONB,
    "title" TEXT,
    "handle" TEXT,
    "images" JSONB[],
    "status" TEXT,
    "vendor" TEXT,
    "options" JSONB[],
    "shop_url" TEXT,
    "variants" JSONB[],
    "body_html" TEXT,
    "product_type" TEXT,
    "published_at" TEXT,
    "published_scope" TEXT,
    "template_suffix" TEXT,
    "admin_graphql_api_id" TEXT,
    "account_id" TEXT NOT NULL,

    CONSTRAINT "ShopifyProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopifyCustomer" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "accountId" TEXT NOT NULL,
    "note" TEXT,
    "tags" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "state" TEXT,
    "currency" TEXT,
    "shop_url" TEXT,
    "addresses" JSONB[],
    "last_name" TEXT,
    "first_name" TEXT,
    "tax_exempt" BOOLEAN,
    "total_spent" DOUBLE PRECISION,
    "orders_count" INTEGER,
    "last_order_id" TEXT,
    "verified_email" BOOLEAN,
    "default_address" JSONB,
    "last_order_name" TEXT,
    "accepts_marketing" BOOLEAN,
    "admin_graphql_api_id" TEXT,
    "multipass_identifier" TEXT,
    "accepts_marketing_updated_at" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,

    CONSTRAINT "ShopifyCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopifyProductVariant" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "accountId" TEXT NOT NULL,
    "sku" TEXT,
    "grams" INTEGER,
    "price" DOUBLE PRECISION,
    "title" TEXT,
    "weight" DOUBLE PRECISION,
    "barcode" TEXT,
    "option1" TEXT,
    "option2" TEXT,
    "option3" TEXT,
    "taxable" BOOLEAN,
    "image_id" TEXT,
    "position" INTEGER,
    "tax_code" TEXT,
    "weight_unit" TEXT,
    "compare_at_price" DOUBLE PRECISION,
    "inventory_policy" TEXT,
    "inventory_item_id" TEXT,
    "requires_shipping" BOOLEAN,
    "inventory_quantity" INTEGER,
    "presentment_prices" JSONB[],
    "fulfillment_service" TEXT,
    "admin_graphql_api_id" TEXT,
    "inventory_management" TEXT,
    "old_inventory_quantity" INTEGER,
    "account_id" TEXT NOT NULL,

    CONSTRAINT "ShopifyProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopifyAccount_myShopifyDomain_key" ON "ShopifyAccount"("myShopifyDomain");

-- CreateIndex
CREATE INDEX "ShopifyOrder_id_account_id_idx" ON "ShopifyOrder"("id", "account_id");

-- CreateIndex
CREATE INDEX "ShopifyOrder_updated_at_account_id_idx" ON "ShopifyOrder"("updated_at", "account_id");

-- CreateIndex
CREATE INDEX "ShopifyProduct_id_account_id_idx" ON "ShopifyProduct"("id", "account_id");

-- CreateIndex
CREATE INDEX "ShopifyProduct_updated_at_account_id_idx" ON "ShopifyProduct"("updated_at", "account_id");

-- CreateIndex
CREATE INDEX "ShopifyCustomer_id_account_id_idx" ON "ShopifyCustomer"("id", "account_id");

-- CreateIndex
CREATE INDEX "ShopifyCustomer_updated_at_account_id_idx" ON "ShopifyCustomer"("updated_at", "account_id");

-- CreateIndex
CREATE INDEX "ShopifyProductVariant_id_account_id_idx" ON "ShopifyProductVariant"("id", "account_id");

-- CreateIndex
CREATE INDEX "ShopifyProductVariant_updated_at_account_id_idx" ON "ShopifyProductVariant"("updated_at", "account_id");

-- AddForeignKey
ALTER TABLE "ShopifyOrder" ADD CONSTRAINT "ShopifyOrder_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ShopifyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopifyProduct" ADD CONSTRAINT "ShopifyProduct_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ShopifyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopifyCustomer" ADD CONSTRAINT "ShopifyCustomer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ShopifyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopifyProductVariant" ADD CONSTRAINT "ShopifyProductVariant_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ShopifyAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
