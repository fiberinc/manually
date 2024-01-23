import { z } from 'zod';
import {
	ShopifyCustomerStruct,
	ShopifyOrderStruct,
	ShopifyProductStruct,
} from './schemas';

//

export type Order = z.infer<typeof ShopifyOrderStruct>;

export type Product = z.infer<typeof ShopifyProductStruct>;

export type Customer = z.infer<typeof ShopifyCustomerStruct>;

//

export interface ShopifyCredential {
	accessToken: string;
	myShopifyDomain: string;
	scopes?: string[];
}
