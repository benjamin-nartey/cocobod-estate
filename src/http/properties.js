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

export const getPropertyUnitsForProperty = (propertyUnitId) => {
  return axiosInstance.get(`/property-units/moderation/${propertyUnitId}`, {
    params: { propertyFilter: id },
  });
};
