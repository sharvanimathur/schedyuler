'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

export async function updateUsername(username) {
	const res = await auth();
	if (!res.userId) {
		throw new Error('User not authenticated');
	}

	const existingUsername = await db.user.findUnique({
		where: { username },
	});

	if (existingUsername && existingUsername.id !== res.userId) {
		throw new Error('Username already exists');
	}

	await db.user.update({
		where: { clerkUserId: res.userId },
		data: { username },
	});

	(await clerkClient()).users.updateUser(res.userId, {
		username,
	});

	return { success: true, message: 'Username updated successfully' };
}

export async function getUserByUsername(username) {
	const user = await db.user.findUnique({
		where: { username },
		select: {
			id: true,
			name: true,
			email: true,
			imageUrl: true,
			events: {
				where: {
					isPrivate: false,
				},
				orderBy: {
					createdAt: 'desc',
				},
				select: {
					id: true,
					title: true,
					description: true,
					duration: true,
					isPrivate: true,
					_count: {
						select: { bookings: true },
					},
				},
			},
		},
	});

	return user;
}
