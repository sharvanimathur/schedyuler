'use client';
import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usernameSchema } from '@/app/_lib/validators';
import { updateUsername } from '@/actions/users';
import { BarLoader } from 'react-spinners';
import useFetch from '@/hooks/use-fetch';
import { getLatestUpdates } from '@/actions/dashboard';
import { format } from 'date-fns';

const Dashboard = () => {
	const { isLoaded, user } = useUser();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(usernameSchema),
	});

	useEffect(() => {
		if (isLoaded) {
			setValue('username', user.username);
		}
	}, [isLoaded]);

	const {
		data: updateUsernameResponse,
		loading,
		error,
		fn: fnUpdateUsername,
	} = useFetch(updateUsername);

	const {
		loading: loadingUpdates,
		data: upcomingMeetings,
		fn: fnUpdates,
	} = useFetch(getLatestUpdates);

	useEffect(() => {
		(async () => await fnUpdates())();
	}, []);

	const onSubmit = async (data) => {
		fnUpdateUsername(data.username);
	};

	return (
		<div className='space-y-8'>
			<Card>
				<CardHeader>
					<CardTitle>Welcome, {user?.firstName}!</CardTitle>
				</CardHeader>
				<CardContent>
					{!loadingUpdates ? (
						<div className='space-y-6 font-light'>
							<div>
								{upcomingMeetings &&
								upcomingMeetings?.length > 0 ? (
									<ul className='list-disc pl-5'>
										{upcomingMeetings?.map((meeting) => (
											<li key={meeting.id}>
												{meeting.event.title} on{' '}
												{format(
													new Date(meeting.startTime),
													'MMM d, yyyy h:mm a'
												)}{' '}
												with {meeting.name}
											</li>
										))}
									</ul>
								) : (
									<p>No upcoming meetings</p>
								)}
							</div>
						</div>
					) : (
						<p>Loading updates...</p>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Your Unique Link</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<div>
							<div className='flex items-center gap-2'>
								<span>/</span>
								<Input
									{...register('username')}
									placeholder='username'
								/>
							</div>
							{errors.username && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.username.message}
								</p>
							)}
							{error && (
								<p className='text-red-500 text-sm mt-1'>
									{error?.message}
								</p>
							)}
							{updateUsernameResponse &&
								updateUsernameResponse.success === true && (
									<p className='text-green-500 text-sm mt-1'>
										{updateUsernameResponse.message}
									</p>
								)}
						</div>
						{loading && (
							<BarLoader
								className='mb-4'
								width={'100%'}
								color='#36d7b7'
							/>
						)}
						<Button type='submit'>Update Username</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Dashboard;
