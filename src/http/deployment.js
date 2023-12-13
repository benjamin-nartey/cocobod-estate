import { useState } from 'react';
import { axiosInstance } from '../axios/axiosInstance';

const deployments = [
  {
    id: crypto.randomUUID(),
    name: 'First Week Deployment.',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    status: 'Completed',
    deployments: [
      {
        id: 1,
        region: 'Ashanti',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },

      {
        id: 2,
        region: 'Greater Accra',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },
      {
        id: 3,
        region: 'Brong Ahafo',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },
      {
        id: 4,
        region: 'Northern',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: '2nd Week Deployment.',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    status: 'Completed',
    deployments: [
      {
        id: 1,
        region: 'Ashanti',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },

      {
        id: 2,
        region: 'Greater Accra',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },
      {
        id: 3,
        region: 'Brong Ahafo',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },
      {
        id: 4,
        region: 'Northern',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'Third Week Depl.',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    status: 'Ongoing',
    deployments: [
      {
        id: 1,
        region: 'Ashanti',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },

      {
        id: 2,
        region: 'Greater Accra',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },
      {
        id: 3,
        region: 'Brong Ahafo',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },
      {
        id: 4,
        region: 'Northern',
        staff: [
          { user: { name: 'Kwasi Ntim' } },
          { user: { name: 'Esi Asiamah' } },
          { user: { name: 'Joe Reagan' } },
          { user: { name: 'Lartey Josiah' } },
        ],
      },
    ],
  },
];

export const addDeployment = (data) => {
  return axiosInstance.post('/deployment', { ...data });
};

export const updateDeployment = (id, data) => {
  return axiosInstance.patch(`/deployment/${id}`, { ...data });
};

export const getPaginatedDeployments = (queryParams) => {
  return axiosInstance.get('/deployment', {
    params: { ...queryParams },
  });
};

export const deleteDeployment = (id) => {
  return axiosInstance.delete(`/deployment/${id}`);
};

export const getAllDeployments = () => {
  return axiosInstance.get('/deployment/all');
};

export const getAllocation = (id, queryParams) => {
  return axiosInstance.get(`/allocation/${id}`, {
    params: { ...queryParams },
  });
};

export const addAllocation = (data) => {
  return axiosInstance.post('/allocation', { ...data });
};

export const updateAllocation = (id, data) => {
  return axiosInstance.patch(`/allocation/${id}`, { ...data });
};

export const deleteAllocation = (id) => {
  return axiosInstance.delete(`/allocation/${id}`);
};
