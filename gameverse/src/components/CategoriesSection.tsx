import { categories } from '../data/games';

interface Props { onNavigate: (page: string, data?: any) => void; }

export default function CategoriesSection({ onNavigate }: Props) {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-head text-xl sm:text-2xl font-bold text-t1">Browse Categories</h2>
            <p className="text-t4 text-[13px] mt-0.5">Find your perfect genre</p>
          </div>
          <button onClick={() => onNavigate('categories')} className="text-primary text-[13px] font-medium hover:text-primary-hover transition-colors">View All →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {categories.map(c => (
            <button key={c.id} onClick={() => onNavigate('category', { category: c.id })}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl glass-card hover:bg-white/[.06] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg border border-transparent hover:border-primary/15">
              <span className="text-3xl group-hover:scale-110 transition-transform">{c.icon}</span>
              <span className="text-[12px] font-medium text-t3 group-hover:text-t1 transition-colors text-center leading-tight">{c.name}</span>
              <span className="text-[10px] text-t4">{c.count}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
