import { Inter } from 'next/font/google';
import React, { Suspense } from 'react';
import Header from '@/components/header';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import CreateEventDrawer from '@/components/create-event';

export const metadata = {
	title: 'Schedyuler',
	description: 'An event scheduling application',
};

const inter = Inter({
	subsets: ['latin'],
});

export default function RootLayout({ children }) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={`${inter.className} antialiased`}>
					{/* Header */}
					<header>
						<Header />
					</header>
					<main className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
						{children}
					</main>
					{/* Footer */}
					<footer className='bg-blue-100 py-12'>
						<div className='container mx-auto text-center px-4 text-grey-600'>
							<p className=''>
								&copy; {new Date().getFullYear()} Schedyuler.
								All rights reserved.
							</p>
						</div>
					</footer>
					<Suspense fallback={<div>Loading create event...</div>}>
						<CreateEventDrawer />
					</Suspense>
				</body>
			</html>
		</ClerkProvider>
	);
}
