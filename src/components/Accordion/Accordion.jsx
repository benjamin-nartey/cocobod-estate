import { useState } from "react";
import PropertyUnitForm from "../PropertyUnitForm/PropertyUnitForm";

const data = [
  {
    title: "Header 1",
    content: <PropertyUnitForm />,
  },
  {
    title: "Header 2",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 3",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
  {
    title: "Header 4",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quibusdam unde cupiditate. Iste aut, repellat commodi illo labore consequatur facere doloremque, officia dolorum saepe iusto reiciendis non exercitationem. At, optio?",
  },
];

const Accordion = () => {
  const [selected, setSelected] = useState(null);

  const toggle = (idx) => {
    if (selected === idx) {
      return setSelected(null);
    }
    setSelected(idx);
    console.log(idx);
  };
  return (
    <div className="wrapper-accordion w-full h-auto flex justify-center items-start ">
      <div className="accordion w-full">
        {data.map((item, idx) => (
          <div className="accordion-item bg-[#f0Ebe1] mb-[5px] py-[10px] px-[20px]">
            <div
              onClick={() => toggle(idx)}
              className="accordion-title flex justify-between items-center cursor-pointer"
            >
              <h2>{item.title}</h2>
              <span>{selected === idx ? "-" : "+"}</span>
            </div>
            <div
              className={
                selected === idx
                  ? "accordion-content show max-h-0  ease-in duration-300 overflow-hidden "
                  : "accordion-content max-h-0 overflow-hidden  ease-out duration-300"
              }
            >
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accordion;
