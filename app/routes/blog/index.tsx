import type { Route } from './+types/index';
import type { PostMeta } from '~/types';
import { useState } from 'react';
import PostCard from '~/components/PostCard';
import Pagination from '~/components/Pagination';
import PostFilter from '~/components/PostFilter';

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ posts: PostMeta[] }> {
  const url = new URL('/posts-meta.json', request.url);
  const res = await fetch(url.href);

  if (!res.ok) throw new Error('Failed to fetch data');
  const data = await res.json();

  data.sort(
    (a: PostMeta, b: PostMeta) =>
      new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return { posts: data };
}

const BlogPage = ({ loaderData }: Route.ComponentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBy, setSearchBy] = useState('');

  const posts: PostMeta[] = loaderData.posts;
  const filteredPosts = searchBy
    ? posts.filter((post) => {
        const value = searchBy.toLowerCase();
        return (
          post.title.toLowerCase().includes(value) ||
          post.excerpt.toLocaleLowerCase().toLowerCase().includes(value)
        );
      })
    : posts;

  const blogsPerPage = 10;
  const numberOfPages = Math.ceil(filteredPosts.length / blogsPerPage);
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;

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
