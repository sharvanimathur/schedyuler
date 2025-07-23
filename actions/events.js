'use server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { eventSchema } from '@/app/_lib/validators';

export async function createEvent(data) {
	const res = await auth();
	if (!res.userId) {
		throw new Error('User not authenticated');
	}

	const validatedSchema = eventSchema.parse(data);

	const user = await db.user.findUnique({
		where: { clerkUserId: res.userId },
	});

	if (!user) {
		throw new Error('User not found!');
	}

	const event = await db.event.create({
		data: {
			...validatedSchema,
			userId: user.id,
		},
	});

	return event;
}

export async function getUserEvents() {
	const res = await auth();
	if (!res.userId) {
		throw new Error('User not authenticated');
	}

	const user = await db.user.findUnique({
		where: { clerkUserId: res.userId },
	});

	if (!user) {
		throw new Error('User not found!');
	}

	const events = await db.event.findMany({
		where: {
			userId: user.id,
		},
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			_count: {
				select: { bookings: true },
			},
		},
	});

	return { events, username: user.username };
}

export async function deleteEvent(eventId) {
	const res = await auth();
	if (!res.userId) {
		throw new Error('User not authenticated');
	}

	const user = await db.user.findUnique({
		where: { clerkUserId: res.userId },
	});

	if (!user) {
		throw new Error('User not found!');
	}

	const event = await db.event.findUnique({
		where: {
			id: eventId,
		},
	});

	if (!event) {
		throw new Error('Event not found');
	}

	if (event && event.userId !== user.id) {
		throw new Error('User is unauthorized to perform this action');
	}

	await db.event.delete({
		where: {
			id: eventId,
		},
	});

	return { success: true };
}

export async function getEventDetails(username, eventId) {
	const event = await db.event.findFirst({
		where: {
			id: eventId,
			user: {
				username: username,
			},
		},
		include: {
			user: {
				select: {
					name: true,
					email: true,
					imageUrl: true,
				},
			},
		},
	});

	return event;
}
