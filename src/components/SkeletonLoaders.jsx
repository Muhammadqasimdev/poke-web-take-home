import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '../contexts/ThemeContext';

export const ChartSkeleton = ({ height = '400px' }) => {
  const { current: theme, isDarkMode } = useTheme();

  return (
    <SkeletonTheme
      baseColor={isDarkMode ? '#374151' : '#f3f4f6'}
      highlightColor={isDarkMode ? '#4b5563' : '#e5e7eb'}
    >
      <div className={`${theme.cardBg} rounded-lg ${theme.shadow} p-6`}>
        <div className="mb-4">
          <Skeleton height={24} width="40%" />
        </div>
        <div style={{ height }}>
          <Skeleton height="100%" />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export const FiltersSkeleton = () => {
  const { current: theme, isDarkMode } = useTheme();

  return (
    <SkeletonTheme
      baseColor={isDarkMode ? '#374151' : '#f3f4f6'}
      highlightColor={isDarkMode ? '#4b5563' : '#e5e7eb'}
    >
      <div className={`${theme.cardBg} rounded-lg ${theme.shadow} p-6 mb-6`}>
        <div className="flex justify-between items-center mb-4">
          <Skeleton height={28} width={200} />
          <Skeleton height={20} width={150} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i}>
              <Skeleton height={20} width="60%" className="mb-2" />
              <Skeleton height={40} />
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export const DashboardSkeleton = () => {
  const { current: theme, isDarkMode } = useTheme();

  return (
    <SkeletonTheme
      baseColor={isDarkMode ? '#374151' : '#f3f4f6'}
      highlightColor={isDarkMode ? '#4b5563' : '#e5e7eb'}
    >
      <div className={`min-h-screen ${theme.bg} py-8`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-start mb-8">
            <div className="text-center flex-1">
              <Skeleton height={48} width="60%" className="mb-2" />
              <Skeleton height={20} width="40%" />
            </div>
            <Skeleton height={40} width={120} />
          </div>

          <FiltersSkeleton />

          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <Skeleton height={40} width={120} />
            <Skeleton height={40} width={120} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default {
  FiltersSkeleton,
  DashboardSkeleton,
};
