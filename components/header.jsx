import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PenBox } from 'lucide-react';
import { Button } from './ui/button';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
import UserMenu from './user-menu';
import { checkUser } from '@/lib/checkUser';

const Header = async () => {
	await checkUser();
	return (
		<nav className='mx-auto px-4 py-2 flex justify-between items-center shadow-medium border-b-2'>
			<Link href='/' className='flex items-center'>
				<Image
					src='/logo.webp'
					alt='Schedyuler Logo'
					width={150}
					height={60}
					className='h-16 w-auto'
				/>
			</Link>
			<div className='flex items-center gap-4'>
				<Link href='/events?create=true'>
					<Button className='flex items-center gap-2'>
						<PenBox size={18} /> Create Event
					</Button>
				</Link>
				<SignedOut>
					<SignInButton forceRedirectUrl='/dashboard'>
						<Button variant='outline'>Login</Button>
					</SignInButton>
				</SignedOut>
				<SignedIn>
					<UserMenu />
				</SignedIn>
			</div>
		</nav>
	);
};

export default Header;
