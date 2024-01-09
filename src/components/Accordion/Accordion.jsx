import { Fragment, useEffect, useState } from 'react';
import PropertyUnitForm from '../PropertyUnitForm/PropertyUnitForm';
import { Button, Form } from 'antd';
import { useIndexedDB } from 'react-indexed-db-hook';

const Accordion = ({ id, form }) => {
  const [selected, setSelected] = useState(null);
  const [selectedPropType, setSelectedPropType] = useState('');
  const [propertyUnits, setPropertyUnits] = useState([]);

  // const form = Form.useFormInstance();
  const { getAll: getAllpropertyReferences } =
    useIndexedDB('propertyReferences');

  const toggle = (idx) => {
    if (selected === idx) {
      return setSelected(null);
    }
    setSelected(idx);
  };

  const getAllPropertyUnits = () => {
    getAllpropertyReferences().then((propertyReferences) => {
      const getPropertyUnitsByPropPseudoId = propertyReferences.filter(
        (references) => references?.propertyReferenceCategory?.id === id
      );

      const data = getPropertyUnitsByPropPseudoId.map((propertyUnit) => {
        return {
          id: propertyUnit?.id,
          description: propertyUnit?.description,
          descriptionPerFixedAssetReport:
            propertyUnit?.descriptionPerFixedAssetReport,
          floorArea: propertyUnit?.floorArea,
          plotSize: propertyUnit?.plotSize,
          propertyTypeId: propertyUnit?.propertyType?.id,
          occupants: [],
        };
      });

      form.setFieldsValue({
        propertyUnits: data,
      });

      // setPropertyUnits(getPropertyUnitsByPropPseudoId);
    });
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
                          onDoubleClickCapture={() => remove(name)}
                          className="accordion-title flex justify-between items-center cursor-pointer"
                        >
                          <h2 className="text-base font-semibold">{`Property Unit ${
                            key + 1
                          }`}</h2>
                          <span className="text-lg font-semibold">
                            {selected === key ? '-' : '+'}
                          </span>
                        </div>
                        <div
                          className={
                            selected === key
                              ? 'accordion-content show max-h-0 ease-in duration-300 overflow-hidden'
                              : 'accordion-content max-h-0 overflow-hidden ease-out duration-300'
                          }
                        >
                          <PropertyUnitForm name={name} unitFormKey={key} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {fields.length >= 0 && (
                <div className="h-[70px] w-full flex items-center mb-4 ">
                  <button
                    type="button"
                    className="p-2 bg-[#f0Ebe1] border border-solid  font-semibold cursor-pointer rounded w-full text-center"
                    onClick={() => add()}
                  >
                    Add Unit
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
