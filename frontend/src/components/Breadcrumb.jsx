import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";

const Breadcrumb = () => {
  const location = useLocation();

  const breadcrumbItems = useMemo(() => {
    const pathnames = location.pathname.split("/").filter((x) => x);

    return [
      { name: "Home", path: "/" },
      ...pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        // Ubah ke format judul yang lebih manusiawi
        const name = value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        return { name, path: to };
      }),
    ];
  }, [location.pathname]);

  return (
    <section className="container mx-auto px-4 py-6">
      <nav className="text-sm">
        <ol className="flex">
          {breadcrumbItems.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && <span className="px-1.5 text-primary"><ChevronRight className="w-4 h-4" /></span>}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-primary font-medium">{item.name}</span>
              ) : (
                <a href={item.path} className="text-black hover:underline">
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
};

export default Breadcrumb;
