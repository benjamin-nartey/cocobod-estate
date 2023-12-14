import { axiosInstance } from '../axios/axiosInstance';

export const mergePropertyToPropertyUnit = (data) => {
  return axiosInstance.patch(
    `/property-reference-categories/${data?.propertyId}`,
    {
      ...data,
    }
  );
};

export const getPaginatedPropertiesForModeration = (regionId, queryParams) => {
  return axiosInstance.get(`/properties/moderation/${regionId}`, {
    params: { ...queryParams },
  });
};

export const getPaginatedProperties = (queryParams) => {
  return axiosInstance.get('/properties', { params: { ...queryParams } });
};

export const getPropertyUnitsForProperty = (propertyUnitId) => {
  return axiosInstance.get(
    `/property-units/moderation/property-unit-details/${propertyUnitId}`
  );
};

export const getProperty = (id) => {
  return axiosInstance.get(`/properties/${id}`);
};

export const updateProperty = (id, data) => {
  return axiosInstance.patch(`/properties/${id}`, { ...data });
};

export const getPUnitsReferences = (queryParams = {}) => {
  console.log('running...');
  return axiosInstance.get('/property-references/all', {
    params: { ...queryParams },
  });
};