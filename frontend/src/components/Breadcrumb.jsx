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
        let name = value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

        // Jika setelah /product maka ubah jadi "Boat Detail"
        if (pathnames[index - 1] === "product") {
          name = "Boat Detail";
        }

        return { name, path: to };
      }),
    ];
  }, [location.pathname]);

  return (
    <section className="container mx-auto px-4 py-6">
      <nav className="text-sm">
        <ol className="flex flex-wrap">
          {breadcrumbItems.map((item, index) => {
            // Sembunyikan breadcrumb tertentu
            if (item.name.toLowerCase() === "customer") {
              return null;
            }

            const isLast = index === breadcrumbItems.length - 1;

            return (
              <li key={item.path} className="flex items-center">
                {index > 0 &&
                  (isLast ? (
                    <span className="px-1.5 text-primary">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="px-1.5 text-gray-500">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  ))}

                {isLast ? (
                  item.name === "Product" ? (
                    <span className="text-primary font-medium">Book a Boat</span>
                  ) : (
                    <span className="text-primary font-medium">{item.name}</span>
                  )
                ) : item.name === "Product" ? (
                  <a href={item.path} className="text-black hover:underline">
                    Book a Boat
                  </a>
                ) : (
                  <a href={item.path} className="text-black hover:underline">
                    {item.name}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </section>
  );
};

export default Breadcrumb;
