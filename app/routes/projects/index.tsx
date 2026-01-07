import { useState } from 'react';
import type { Route } from './+types/index';
import type { Project } from '~/types';
import ProjectCard from '~/components/ProjectCard';
import Pagination from '~/components/Pagination';
import { AnimatePresence, motion } from 'framer-motion';

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  const res = await fetch('http://localhost:8000/projects');
  const data = await res.json();

  return { projects: data };
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  const { projects } = loaderData as { projects: Project[] };

  // Get unique categories
  const categories = [
    'All',
    ...new Set(projects.map((project) => project.category)),
  ];

  // Filter projects based on selected category
  const filteredProjects = projects.filter((project) =>
    selectedCategory === 'All'
      ? projects
      : project.category === selectedCategory
  );

  // Calculate total number of pages.
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Get projects for the current page
  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const currentPageProjects = filteredProjects.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <h2 className='text-3xl font-bold text-white mb-8'>🚀 Projects</h2>

      <div className='flex flex-wrap gap-2 mb-8'>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded text-sm cursor-pointer
              ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
          >
            {category}
          </button>
        ))}
      </div>
      <AnimatePresence mode='wait'>
        <motion.div layout className='grid gap-6 sm:grid-cols-2'>
          {currentPageProjects.map((project) => (
            <motion.div layout key={project.id}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default ProjectsPage;
