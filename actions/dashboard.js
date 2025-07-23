'use server';

import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function getLatestUpdates() {
	const res = await auth();
	if (!res.userId) {
		throw new Error('User not authenticated');
	}

	const user = await db.user.findUnique({
		where: { clerkUserId: res.userId },
	});

	if (!user) {
		throw new Error('User not found');
	}

	const now = new Date();

	const upcomingMeetings = await db.booking.findMany({
		where: {
			userId: user.id,
			startTime: { gte: now },
		},
		include: {
			event: {
				select: {
					title: true,
				},
			},
		},
		orderBy: {
			startTime: 'asc',
		},
		take: 3,
	});

	return upcomingMeetings;
}
