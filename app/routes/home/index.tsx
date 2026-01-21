import type { Route } from './+types/index';
import type {
  Project,
  StrapiResponse,
  StrapiProject,
  StrapiPost,
} from '~/types';
import type { Post } from '~/types';
import FeaturedProjects from '~/components/FeaturedProjects';
import AboutPreview from '~/components/AboutPreview';
import LatestPosts from '~/components/LatestPosts';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'The Friendly Dev' },
    { name: 'description', content: 'Custom website development' },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const [projectRes, postRes] = await Promise.all([
    fetch(
      `${import.meta.env.VITE_API_URL}/projects?filters[featured][$eq]=true&populate=*`,
    ),
    fetch(
      `${import.meta.env.VITE_API_URL}/posts?sort[0]=date:desc&populate=image`,
    ),
  ]);

  if (!projectRes.ok || !postRes.ok)
    throw new Error('Failed to fetch projects or posts');

  const projectsJson: StrapiResponse<StrapiProject> = await projectRes.json();
  const postJson: StrapiResponse<StrapiPost> = await postRes.json();

  const projects: Project[] = projectsJson.data.map((project) => ({
    id: project.id,
    documentId: project.documentId,
    title: project.title,
    description: project.description,
    url: project.url,
    date: project.date,
    category: project.category,
    featured: project.featured,
    image: project.image?.url
      ? `${project.image.url}`
      : '/public/images/no-image.png',
  }));

  const posts: Post[] = postJson.data.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    date: post.date,
    body: post.body,
    image: post.image?.url
      ? `${post.image.url}`
      : '/public/images/no-image.png',
  }));

  return { projects, posts };
}

const HomePage = ({ loaderData }: Route.ComponentProps) => {
  const { projects, posts } = loaderData;

  return (
    <>
      <FeaturedProjects projects={projects} />
      <AboutPreview />
      <LatestPosts posts={posts} />
    </>
  );
};

export default HomePage;
