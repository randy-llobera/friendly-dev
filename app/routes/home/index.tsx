import type React from 'react';
import type { Route } from './+types/index';
import FeaturedProjects from '~/components/FeaturedProjects';
import type { Project } from '~/types';
import AboutPreview from '~/components/AboutPreview';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'The Friendly Dev' },
    { name: 'description', content: 'Custom website development' },
  ];
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`);
  const data = await res.json();

  return { projects: data };
}

const HomePage = ({ loaderData }: Route.ComponentProps) => {
  const { projects }: { projects: Project[] } = loaderData as {
    projects: Project[];
  };

  return (
    <>
      <FeaturedProjects projects={projects} count={2} />
      <AboutPreview />
    </>
  );
};

export default HomePage;
