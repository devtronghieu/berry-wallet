import { FC, useState } from "react";

type onClick = () => void;
interface Props {
  className?: string;
  navTitle?: string[];
  navOnClick?: onClick[];
  activeTab?: string;
}

export const TabBar: FC<Props> = ({ navTitle = [], className, navOnClick, activeTab = "" }) => {
  const [activeIndex, setActiveIndex] = useState(!activeTab ? 0 : navTitle.indexOf(activeTab));
  return (
    <nav className={`nav-background ${className} ${"active-" + activeIndex}`}>
      <ul className="flex gap-1">
        {navTitle.map((title, index) => (
          <li key={title} className="nav-item">
            <button
              key={index}
              className={`nav-link ${index === activeIndex ? "nav-active" : ""}`}
              onClick={() => {
                setActiveIndex(index);
                if (navOnClick) navOnClick[index]();
              }}
            >
              {title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TabBar;
