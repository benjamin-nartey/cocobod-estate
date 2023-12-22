import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../axios/axiosInstance';

//Add area hook
const addRegion = (region) => {
  return axiosInstance.post('/region', region);
};

export const useAddRegionData = () => {
  const queryClient = useQueryClient();
  return useMutation(addRegion, {
    onSuccess: () => {
      queryClient.invalidateQueries('region');
    },
  });
};

//Add location hook
const addLocation = (location) => {
  return axiosInstance.post('/locations', location);
};

export const useAddLocationData = () => {
  const queryClient = useQueryClient();
  return useMutation(addLocation, {
    onSuccess: () => {
      queryClient.invalidateQueries('locations');
    },
  });
};

//Add property hook
const addProperty = (property) => {
  return axiosInstance.post('/properties', property);
};

export const useAddPropertyData = () => {
  const queryClient = useQueryClient();
  return useMutation(addProperty, {
    onSuccess: () => {
      queryClient.invalidateQueries('properties');
    },
  });
};

//Add propertyType hook
const addPropertyType = (propertyType) => {
  return axiosInstance.post('/property-types', propertyType);
};

export const useAddPropertyTypeData = () => {
  const queryClient = useQueryClient();
  return useMutation(addPropertyType, {
    onSuccess: () => {
      queryClient.invalidateQueries('propertyTypes');
    },
  });
};

//Add user hook
const addUser = (user) => {
  return axiosInstance.post('/users', user);
};

export const useAddUserData = () => {
  const queryClient = useQueryClient();
  return useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });
};

const addRole = (role) => {
  return axiosInstance.post('/roles', role);
};

export const useAddRoleData = () => {
  const queryClient = useQueryClient();
  return useMutation(addRole, {
    onSuccess: () => {
      queryClient.invalidateQueries('roles');
    },
  });
};


