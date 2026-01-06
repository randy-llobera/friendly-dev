import Hero from '~/components/Hero';
import type { Route } from './+types/index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'The Friendly Dev' },
    { name: 'description', content: 'Custom website development' },
  ];
}

export default function Home() {
  return (
    <section>
      <Hero name='Randy' />
    </section>
  );
}
