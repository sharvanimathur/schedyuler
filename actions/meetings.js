'use server';

import { db } from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { google } from 'googleapis';

export async function getUserMeetings(type = 'upcoming') {
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

	const meetings = await db.booking.findMany({
		where: {
			userId: user.id,
			startTime: type === 'upcoming' ? { gte: now } : { lt: now },
		},
		include: {
			event: {
				include: {
					user: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			},
		},
		orderBy: {
			startTime: type === 'upcoming' ? 'asc' : 'desc',
		},
	});

	return meetings;
}

export async function cancelMeeting(meetingId) {
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

	const meeting = await db.booking.findUnique({
		where: { id: meetingId },
		include: { event: true, user: true },
	});

	if (!meeting || meeting.userId !== user.id) {
		throw new Error('Meeting not found or unauthorized');
	}

	// Cancel the meeting in Google Calendar
	const { data } = await (
		await clerkClient()
	).users.getUserOauthAccessToken(meeting.user.clerkUserId, 'google');

	const token = data[0]?.token;

	const oauth2Client = new google.auth.OAuth2();
	oauth2Client.setCredentials({ access_token: token });

	const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

	try {
		await calendar.events.delete({
			calendarId: 'primary',
			eventId: meeting.googleEventId,
		});
	} catch (error) {
		console.error('Failed to delete event from Google Calendar:', error);
	}

	// Delete the meeting from the database
	await db.booking.delete({
		where: { id: meetingId },
	});

	return { success: true };
}
