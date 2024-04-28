import { FC, useState } from "react";

interface Props {
  className?: string;
  navTitle?: string[];
  navLink?: string[];
}

const Navbar: FC<Props> = ({ navTitle = [], className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <nav className={`nav-background ${className} ${"active-" + activeIndex}`}>
      <ul className="flex gap-1">
        {navTitle.map((title, index) => (
          <li className="nav-item">
            <button
              key={index}
              className={`nav-link ${index === activeIndex ? "nav-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              {title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
