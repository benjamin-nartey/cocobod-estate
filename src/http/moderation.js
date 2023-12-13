import { axiosInstance } from '../axios/axiosInstance';

export const getModerationPopertyUnitList = (propertyId, queryParams) => {
  return axiosInstance.get(`/property-units/moderation/${propertyId}`, {
    params: { ...queryParams },
  });
};

export const getRegionalPropertyCount = () => {
  return axiosInstance.get('/properties/moderation/region-count');
};

export const approveModeration = (propertyUnitId, data) => {
  return axiosInstance.patch(
    `/property-units/moderation/property-unit-details/${propertyUnitId}/approve`,
    { ...data }
  );
};
