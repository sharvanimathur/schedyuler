import { z } from 'zod';

export const usernameSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(20)
		.regex(
			/^[a-zA-Z0-9_]+$/,
			'Username must be alphanumeric or underscore'
		),
});

export const eventSchema = z.object({
	title: z
		.string()
		.min(1, 'Title is required')
		.max(100, 'Title must be less than 100 characters'),
	description: z
		.string()
		.max(500, 'Description must be less than 500 characters')
		.min(1, 'Description is required'),
	duration: z.number().int().positive('Duration must be a positive integer'),
	isPrivate: z.boolean(),
});

export const daySchema = z
	.object({
		isAvailable: z.boolean(),
		startTime: z.string().optional(),
		endTime: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.isAvailable) {
				return data.startTime < data.endTime;
			}
			return true;
		},
		{
			message: 'End time must be more than start time',
			path: ['endTime'],
		}
	);

export const availabilitySchema = z.object({
	monday: daySchema,
	tuesday: daySchema,
	wednesday: daySchema,
	thursday: daySchema,
	friday: daySchema,
	saturday: daySchema,
	sunday: daySchema,
	timeGap: z.number().min(0, 'Time gap must be 0 or more minutes').int(),
});

export const bookingSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email'),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
	time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
	additionalInfo: z.string().optional(),
});
