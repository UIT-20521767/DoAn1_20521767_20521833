import { useState, useEffect } from 'react';
import { mainApi } from '@/api/main_api';
import * as apiEndpoints from '@/api/api_endpoints';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { redirectSub } from "@/redux/reducers/subCategories";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const CategoryList: React.FC = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<Category[]>([]);

  function handleCategory(categorySlug: any) {
    dispatch(redirectSub(categorySlug));
  }

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const result = await mainApi.get(apiEndpoints.GET_CATEGORIES);
        const data = result.data.data;
        setCategories(
          data.map((item: any) => {
            return {
              id: item._id,
              name: item.categoryName,
              slug: item.categorySlug,
            };
          })
        );
      } catch (error: any) {
        console.log(error);
      }
    };

    getAllCategories();
  }, []);

  return (
    <div className="flex flex-row">
      <div className="">
        {categories.map((category, index) => {
          return (
            <div key={category.id}>
              <Link
                to={`/product/${category.slug}`}
                className="block px-[10rem] md:px-10 py-2 font-semibold text-base text-black hover:bg-gray-200"
                onClick={() => handleCategory(category)}
              >
                {category.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;