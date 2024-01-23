import { z } from 'zod';

export const ShopifyOrderStruct = z.object({
	id: z.string(),
	created_at: z.string(),
	updated_at: z.string().nullable(),

	// id                          String    @id
	// created_at                  DateTime
	// updated_at                  DateTime?
	// name                        String?
	// note                        String?
	// tags                        String?
	// test                        Boolean?
	// email                       String?
	// phone                       String?
	// token                       String?
	// app_id                      String?
	// number                      Int?
	// gateway                     String?
	// refunds                     Json[]
	// user_id                     String?
	// currency                    String?
	// customer                    Json?
	// shop_url                    String?
	// closed_at                   String?
	// confirmed                   Boolean?
	// device_id                   String?
	// reference                   String?
	// tax_lines                   Json[]
	// total_tax                   Float?
	// browser_ip                  String?
	// cart_token                  String?
	// line_items                  Json[]
	// source_url                  String?
	// checkout_id                 String?
	// location_id                 String?
	// source_name                 String?
	// total_price                 Float?
	// cancelled_at                String?
	// fulfillments                Json[]
	// landing_site                String?
	// order_number                Int?
	// processed_at                String?
	// total_weight                Int?
	// cancel_reason               String?
	// contact_email               String?
	// total_tax_set               Json?
	// checkout_token              String?
	// client_details              Json?
	// discount_codes              Json[]
	// referring_site              String?
	// shipping_lines              Json[]
	// subtotal_price              Float?
	// taxes_included              Boolean?
	// billing_address             Json?
	// customer_locale             String?
	// note_attributes             Json[]
	// payment_details             Json?
	// total_discounts             Float?
	// total_price_set             Json?
	// total_price_usd             Float?
	// financial_status            String?
	// landing_site_ref            String?
	// order_status_url            String?
	// shipping_address            Json?
	// current_total_tax           Float?
	// processing_method           String?
	// source_identifier           String?
	// total_outstanding           Float?
	// fulfillment_status          String?
	// subtotal_price_set          Json?
	// total_tip_received          Float?
	// current_total_price         Float?
	// total_discounts_set         Json?
	// admin_graphql_api_id        String?
	// discount_allocations        Json[]
	// presentment_currency        String?
	// current_total_tax_set       Json?
	// payment_gateway_names       String[]
	// current_subtotal_price      Float?
	// total_line_items_price      Float?
	// buyer_accepts_marketing     Boolean?
	// current_total_discounts     Float?
	// current_total_price_set     Json?
	// current_total_duties_set    String?
	// total_shipping_price_set    Json?
	// original_total_duties_set   String?
	// current_subtotal_price_set  Json?
	// total_line_items_price_set  Json?
	// current_total_discounts_set Json?
	// account_id                  String
	// pf_id                       String    @default(dbgenerated("gen_random_uuid()")) @db.Uuid
	// pf_created_at               DateTime
	// pf_updated_at               DateTime?
});

export const ShopifyCustomerStruct = z.object({
	id: z.string(),
	created_at: z.string(),
	updated_at: z.string().nullable(),
});

export const ShopifyProductStruct = z.object({
	id: z.string(),
	created_at: z.string(),
	updated_at: z.string().nullable(),
});
