import PropTypes from 'prop-types';
import { Icon } from "@iconify/react";
import DropdownMenu from "../../component/DropdownMenu";
import { useEffect, useState } from 'react';

SearchWithCategory.propTypes = {
  categories: PropTypes.array,
  query: PropTypes.string,
  categoryId: PropTypes.number,
  onSearch: PropTypes.func,
}

const ALL_CATEGORY = { id: 0, categoryName: 'All category' };

export default function SearchWithCategory({ categories, categoryId, onSearch }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState();

  useEffect(() => {
    const selected = categories.find(_item => _item.id = categoryId);
    if (selected)
      setCategory(selected);
    else
      setCategory(ALL_CATEGORY)
  }, [categories, categoryId]);

  const handleSearch = () => {
    onSearch({ query, category })
  }

  return (
    <div className="flex gap-2 mb-12 lg:mb-40 px-16">
      <input className='input input-lg grow shadow-2xl shadow-neutral/40 '
        placeholder='What are you looking For....'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <DropdownMenu
        className="rounded-full input-lg shadow-2xl bg-white shadow-neutral/40 min-w-[240px]"
        summary={category?.categoryName}
      >
        <div className="shadow bg-base-100 rounded p-2 mt-2 min-w-max ">
          {categories.map((item, index) =>
            <div className="rounded-lg hover:bg-neutral/50 px-3  w-full py-1 mb-2 cursor-pointer"
              key={index}
              onClick={() => setCategory(item)}>
              {item.categoryName}
            </div>
          )}
        </div>
      </DropdownMenu>
      <button className='btn gap-2 btn-lg text-white shadow-2xl shadow-neutral/40  ml-5'
        onClick={handleSearch}
      >
        <Icon icon={'fa:search'} className="text-lg" />
        Search
      </button>
    </div>
  )
}