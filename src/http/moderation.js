import { axiosInstance } from '../axios/axiosInstance';

export const getModerationPopertyUnitList = (propertyId, queryParams) => {
  return axiosInstance.get(`/property-units/moderation/${propertyId}`, {
    params: { ...queryParams },
  });
};

export const getRegionalPropertyCount = () => {
  return axiosInstance.get('/properties/moderation/region-count');
};
