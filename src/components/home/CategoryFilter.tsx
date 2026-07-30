import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryFilter = ({ categories, selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {categories.map((category) => {
        const isActive = selected === category;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`relative px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-300 ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
{isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-white/10 border border-white/20 rounded-full"
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
