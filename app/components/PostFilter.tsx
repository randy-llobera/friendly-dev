type PostFilterProps = {
  searchBy: string;
  onFilterChange: (searchBy: string) => void;
};
const PostFilter = ({ searchBy, onFilterChange }: PostFilterProps) => {
  return (
    <div className='mb-6'>
      <input
        type='text'
        value={searchBy}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder='Search Posts...'
        className='w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
    </div>
  );
};

export default PostFilter;
