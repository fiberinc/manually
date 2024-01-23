import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
	datasources: {
		db: {
			url: '',
		},
	},
	// log: debug || PRISMA_DEBUG ? ['query'] : undefined,
});
