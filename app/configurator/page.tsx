'use client';

import { Suspense } from 'react';
import Head from 'next/head';
import VehicleBuilder from '@/components/vehicle-builder/VehicleBuilder';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Vehicle Builder | Your Company</title>
        <meta name="description" content="Configure your custom vehicle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <VehicleBuilder />
        </Suspense>
      </main>
    </div>
  );
}
