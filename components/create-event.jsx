'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { useRouter, useSearchParams } from 'next/navigation';
import EventForm from '@/components/event-form'; // Assuming this is the path to your EventForm component

const CreateEventDrawer = () => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const create = searchParams.get('create');
		if (create === 'true') {
			setIsOpen(true);
		}
	}, [searchParams]);

	const handleClose = () => {
		setIsOpen(false);
		if (searchParams.get('create') === 'true') {
			router.replace(window.location.pathname); // Redirect to events page
		}
	};

	return (
		<Drawer open={isOpen} onClose={handleClose}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Create New Event</DrawerTitle>
				</DrawerHeader>
				<EventForm
					onSubmitForm={() => {
						handleClose();
					}}
				/>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button onClose={handleClose} variant='outline'>
							Cancel
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default CreateEventDrawer;
