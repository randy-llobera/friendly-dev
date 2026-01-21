import type { Route } from './+types/index';
import type { Post, StrapiPost, StrapiResponse } from '~/types';
import { useState } from 'react';
import PostCard from '~/components/PostCard';
import Pagination from '~/components/Pagination';
import PostFilter from '~/components/PostFilter';

export async function loader({ request }: Route.LoaderArgs) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/posts?populate=image&sort=date:desc`,
  );

  if (!res.ok) throw new Error('Failed to fetch data');
  const json: StrapiResponse<StrapiPost> = await res.json();

  const posts: Post[] = json.data.map((post) => ({
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

  return { posts };
}

const BlogPage = ({ loaderData }: Route.ComponentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBy, setSearchBy] = useState('');

  const posts = loaderData.posts;
  const filteredPosts = searchBy
    ? posts.filter((post) => {
        const value = searchBy.toLowerCase();
        return (
          post.title.toLowerCase().includes(value) ||
          post.excerpt.toLocaleLowerCase().toLowerCase().includes(value)
        );
      })
    : posts;

  const postsPerPage = 3;
  const numberOfPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);

  return (
    <div className='max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900'>
      <h2 className='text-3xl text-white font-bold mb-8'>📝 Blog</h2>
      <PostFilter
        searchBy={searchBy}
        onFilterChange={(value) => {
          setSearchBy(value);
          setCurrentPage(1);
        }}
      />

      <div className='space-y-8'>
        {currentPosts.length === 0 ? (
          <p className='text-gray-400 text-center'>No posts found</p>
        ) : (
          currentPosts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>

      {numberOfPages > 1 && (
        <Pagination
          totalPages={numberOfPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default BlogPage;
