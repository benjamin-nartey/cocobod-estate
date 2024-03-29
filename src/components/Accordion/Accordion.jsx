import { Fragment, useEffect, useState } from "react";
import PropertyUnitForm from "../PropertyUnitForm/PropertyUnitForm";
import { Button, Form } from "antd";
import { useIndexedDB } from "react-indexed-db-hook";
import { useLocation } from "react-router-dom";
import { MdAddCircleOutline } from "react-icons/md";
import { BiMinusCircle } from "react-icons/bi";

const Accordion = ({ id, form }) => {
  const [selected, setSelected] = useState(null);
  const [selectedPropType, setSelectedPropType] = useState("");
  const [propertyUnits, setPropertyUnits] = useState([]);
  const location = useLocation();
  const pathName = location.pathname;

  // const form = Form.useFormInstance();
  const { getAll: getAllpropertyReferences } =
    useIndexedDB("propertyReferences");

  const { getAll: getAllProperty } = useIndexedDB("property");

  const toggle = (idx) => {
    if (selected === idx) {
      return setSelected(null);
    }
    setSelected(idx);
  };

  const getAllPropertyUnits = () => {
    if (id && pathName.includes("property-capture")) {
      getAllpropertyReferences().then((propertyReferences) => {
        const getPropertyUnitsByPropPseudoId = propertyReferences.filter(
          (references) => references?.propertyReferenceCategory?.id === id
        );

        const data = getPropertyUnitsByPropPseudoId.map((propertyUnit) => {
          console.log(propertyUnit.propertyType.attributes[0]);
          return {
            id: propertyUnit?.id,
            description: propertyUnit?.description,
            descriptionPerFixedAssetReport:
              propertyUnit?.descriptionPerFixedAssetReport,
            [propertyUnit.propertyType.attributes[0] === "floorArea"
              ? "floorArea"
              : "plotSize"]:
              propertyUnit.propertyType.attributes[0] === "floorArea"
                ? propertyUnit.floorArea
                : propertyUnit.plotSize,

            propertyTypeId: propertyUnit?.propertyType?.id,
            occupants: [],
          };
        });

        console.log(data);

        form.setFieldsValue({
          propertyUnits: data,
        });

        // setPropertyUnits(getPropertyUnitsByPropPseudoId);
      });
    } else {
      getAllProperty().then((properties) => {
        const property = properties?.filter(
          (property) => `${property?.id}` === `${id}`
        );

        const data = property.map((prop) => {
          return prop?.propertyUnits.map((unit) => {
            console.log({ unit });
            console.log(unit?.propertyOccupancy);
            return {
              id: unit?.propertyReferenceId,
              description: unit?.description,
              descriptionPerFixedAssetReport:
                unit?.descriptionPerFixedAssetReport,
              [unit?.floorArea ? "floorArea" : "plotSize"]: unit?.floorArea
                ? unit.floorArea
                : unit.plotSize,

              propertyTypeId: unit?.propertyTypeId,
              occupants: unit?.propertyOccupancy.map((occupancy) => {
                return {
                  occupantType: occupancy?.category,
                  [occupancy?.clientOccupantId ? "occupantId" : "occupantName"]:
                    occupancy?.clientOccupantId
                      ? occupancy?.clientOccupantId
                      : occupancy?.name,
                };
              }),
              condition: unit?.propertyUnitStates[0].condition,
              remarks: unit?.propertyUnitStates[0]?.remarks,
            };
          });
        });

        console.log(data[0]);

        form.setFieldsValue({
          propertyUnits: data[0],
        });
      });
    }
  };

  useEffect(() => {
    if (id) {
      getAllPropertyUnits();
    }
  }, [id.id]);

  // useEffect(() => {
  //   if (propertyUnits?.length) {
  //     console.log(id);

  //   }
  // }, [propertyUnits?.length]);

  return (
    <Fragment>
      {id && (
        <Form.List name="propertyUnits">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => {
                return (
                  <div
                    className="wrapper-accordion w-full h-auto flex justify-center items-start"
                    key={key}
                  >
                    <div className="accordion w-full">
                      <div className="accordion-item bg-[#f0Ebe1] mb-[5px] py-[10px] px-[20px]">
                        <div
                          onClick={() => toggle(key)}
                          className="accordion-title flex justify-between items-center cursor-pointer"
                        >
                          <h2 className="text-base font-semibold">{`Property Unit ${
                            key + 1
                          }`}</h2>
                          <span className="text-lg font-semibold">
                            {selected === key ? "-" : "+"}
                          </span>
                        </div>
                        <div
                          className={
                            selected === key
                              ? "accordion-content show max-h-0 ease-in duration-300 overflow-hidden"
                              : "accordion-content max-h-0 overflow-hidden ease-out duration-300"
                          }
                        >
                          <PropertyUnitForm name={name} unitFormKey={key} />
                        </div>

                        <div className="w-full flex justify-center items-center">
                          <button
                            onClick={() => remove(name)}
                            className={
                              selected === key
                                ? "delete-btn show overflow-hidden text-center p-3 rounded-full translate-y-[-3.5rem] bg-[#f0Ebe1]"
                                : "max-h-0 hidden"
                            }
                          >
                          <BiMinusCircle size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {fields.length >= 0 && (
                <div className="h-[70px] w-full flex items-center justify-center mb-4 ">
                  <button
                    type="button"
                    className="p-3 bg-[#f0Ebe1] font-semibold cursor-pointer rounded-full text-center"
                    onClick={() => add()}
                  >
                    <MdAddCircleOutline size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </Form.List>
      )}
    </Fragment>
  );
};

export default Accordion;
