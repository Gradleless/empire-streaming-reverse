import { Metadata } from 'next';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

export const metadata: Metadata = {
  title: '404, Page non trouvée',
};

export default function NotFound() {
  return (
    <main>
      <section className='bg-white'>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
          <RiAlarmWarningFill
            size={60}
            className='drop-shadow-glow animate-flicker text-red-500'
          />
          <h1 className='mt-8 text-4xl md:text-6xl'>
            Oh non, il semble que tu sois tombé sur une mauvaise page !
          </h1>
          <a href='/'>Repars mtn jsp c'que tu fous là</a>
        </div>
      </section>
    </main>
  );
}
