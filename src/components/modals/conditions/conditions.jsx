import { Modal, Table } from 'antd';
import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../../../store/store';

const colums = [
  {
    title: 'RATINGS',
    dataIndex: 'ratings',
  },
  {
    title: 'PHYSICAL OBSERVATIONS',
    dataIndex: 'physical_observations',
  },
];

const dataSource = [
  {
    ratings: 'Very Good',
    physical_observations:
      'Devoid of any serious defects and does not require immediate repair or redecoration.',
    key: 2,
  },
  {
    ratings: 'Good',
    physical_observations:
      'Has minor defects that are easily recognizable such as broken aprons, broken gutters, defaced walls, rotten fascia boards, bird infestation and minor wall cracks.',
    key: 3,
  },

  {
    ratings: 'Fair',
    physical_observations:
      'Maintenance levels are below average and could cost quite significant amounts on maintenance or repairs. Defects include major cracks in walls/floor, rotten ceiling, roof leakages, broken aprons and gutters, waste water spillage etc.',
    key: 5,
  },

  {
    ratings: 'Poor/Dilapidated',
    physical_observations:
      'Has terrible defects such as collapsed portion of walls, blown off parts or entirety of the roof system and severe structural cracks posing health, safety and environmental issues making the property dangerous for occupation and should be recommended for either immediate rehabilitation or demolition.',
    key: 9,
  },
  {
    ratings: 'Write Off',
    physical_observations: 'Damaged beyond repairs and needs to be written off',
    key: 10,
  },
];

const ConditionsModal = () => {
  const snap = useSnapshot(state);
  const { showConditionsModal } = snap.modalSlice;

  return (
    <div>
      <Modal
        open={showConditionsModal}
        footer={false}
        onCancel={() => state.modalSlice.toggleshowConditionsModal()}
        style={{ width: '80%' }}
      >
        <div className="mt-10">
          <Table
            columns={colums}
            dataSource={dataSource}
            pagination={false}
            style={{ width: '100%' }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ConditionsModal;
