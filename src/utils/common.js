export const hasAllowedPermission = (user, allowedPermissions) => {
  const userPermissions = user?.roles.flatMap((role) => role.permissions);

  return userPermissions?.some((permission) =>
    allowedPermissions?.includes(permission.name)
  );
};

[];

export const PERMISSIONS = {
  LIST_ROLE: 'list.role',
  VIEW_ROLE: 'view.role',
  CREATE_ROLE: 'create.role',
  UPDATE_ROLE: 'update.role',
  DELETE_ROLE: 'delete.role',
  LIST_PERMISSION: 'list.permission',

  LIST_USER: 'list.user',
  LIST_USER_GLOBAL: 'list.user.global',
  LIST_USER_STAFF: 'list.user.staff',
  LIST_USER_STAFF_GLOBAL: 'list.user.staff.global',
  VIEW_USER: 'view.user',
  VIEW_USER_GLOBAL: 'view.user.global',
  CREATE_USER: 'create.user',
  CREATE_USER_GLOBAL: 'create.user.staff.global',
  UPDATE_USER: 'update.user',
  UPDATE_STAFF_GLOBAL: 'update.user.staff.global',

  LIST_DIVISION: 'list.division',
  VIEW_DIVISION: 'view.division',
  CREATE_DIVISION: 'create.division',
  UPDATE_DIVISION: 'update.division',
  DELETE_DIVISION: 'delete.division',

  LIST_DEPARTMENT: 'list.department',
  LIST_DEPARTMENT_GLOBAL: 'list.department.global',
  VIEW_DEPARTMENT: 'view.department',
  VIEW_DEPARTMENT_GLOBAL: 'view.department.global',
  CREATE_DEPARTMENT: 'create.department',
  CREATE_DEPARTMENT_GLOBAL: 'create.department.global',
  UPDATE_DEPARTMENT: 'update.department',
  UPDATE_DEPARTMENT_GLOBAL: 'update.department.global',
  DELETE_DEPARTMENT: 'delete.department',
  DELETE_DEPARTMENT_GLOBAL: 'delete.department.global',

  LIST_REGION: 'list.region',
  VIEW_REGION: 'view.region',
  CREATE_REGION: 'create.region',
  UPDATE_REGION: 'update.region',
  DELETE_REGION: 'delete.region',
  CREATE_REGION_BULK: 'create.region-bulk',

  LIST_DEPLOYMENT: 'list.deployment',
  VIEW_DEPLOYMENT: 'view.deployment',
  CREATE_DEPLOYMENT: 'create.deployment',
  UPDATE_DEPLOYMENT: 'update.deployment',
  DELETE_DEPLOYMENT: 'delete.deployment',

  LIST_ALLOCATION: 'list.allocation',
  VIEW_ALLOCATION: 'view.allocation',
  CREATE_ALLOCATION: 'create.allocation',
  UPDATE_ALLOCATION: 'update.allocation',
  DELETE_ALLOCATION: 'delete.allocation',

  LIST_DISTRICT: 'list.district',
  VIEW_DISTRICT: 'view.district',
  CREATE_DISTRICT: 'create.district',
  UPDATE_DISTRICT: 'update.district',
  DELETE_DISTRICT: 'delete.district',
  CREATE_DISTRICT_BULK: 'create.district-bulk',

  LIST_LOCATION: 'list.location',
  VIEW_LOCATION: 'view.location',
  CREATE_LOCATION: 'create.location',
  UPDATE_LOCATION: 'update.location',
  DELETE_LOCATION: 'delete.location',
  CREATE_LOCATION_BULK: 'create.location-bulk',

  LIST_PROPERTY_TYPE: 'list.property-type',
  VIEW_PROPERTY_TYPE: 'view.property-type',
  CREATE_PROPERTY_TYPE: 'create.property-type',
  UPDATE_PROPERTY_TYPE: 'update.property-type',
  DELETE_PROPERTY_TYPE: 'delete.property-type',

  LIST_PROPERTY: 'list.property',
  LIST_PROPERTY_GLOBAL: 'list.property.global',
  VIEW_PROPERTY: 'view.property',
  VIEW_PROPERTY_GLOBAL: 'view.property.global',
  CREATE_PROPERTY: 'create.property',
  CREATE_PROPERTYP_GLOBAL: 'create.property.global',
  CREATE_PROPERTY_CAPTURE: 'create.property-capture',
  UPDATE_PROPERTY: 'update.property',
  UPDATE_PROPERTY_GLOBAL: 'update.property.global',
  DELETE_PROPERTY: 'delete.property',
  DELETE_PROPERTY_GLOBAL: 'delete.property.global',
  CREATE_PROPERTY_PHOTOS: 'create.property.photos',
  CREATE_PROPERTY_PHOTOS_GLOBAL: 'create.property.photos.global',
  CREATE_PROPERTY_FEATURED_PHOTOS: 'create.property.featured-photos',
  CREATE_PROPERTY_FEATURED_PHOTOS_GLOBAL:
    'create.property.featured-photos.global',

  LIST_PROPERTY_UNIT: 'list.property-unit',
  LIST_PROPERTY_UNIT_GLOBAL: 'list.property-unit.global',
  VIEW_PROPERTY_UNIT: 'view.property-unit',
  VIEW_PROPERTY_UNIT_GLOBAL: 'view.property-unit.global',
  CREATE_PROPERTY_UNIT: 'create.property-unit',
  CREATE_PROPERTY_UNIT_GLOBAL: 'create.property-unit.global',
  UPDATE_PROPERTY_UNIT: 'update.property-unit',
  UPDATE_PROPERTY_UNIT_GLOBAL: 'update.property-unit.global',
  DELETE_PROPERTY_UNIT: 'delete.property-unit',
  DELETE_PROPERTY_UNIT_GLOBAL: 'delete.property-unit.global',

  LIST_PROPERTY_REFERENCE: 'list.property-reference',
  LIST_PROPERTY_REFERENCE_GLOBAL: 'list.property-reference.global',
  VIEW_PROPERTY_REFERENCE: 'view.property-reference',
  VIEW_PROPERTY_REFERENCE_GLOBAL: 'view.property-reference.global',
  CREATE_PROPERTY_REFERENCE_BATCH: 'create.property-reference-batch',

  LIST_PROPERTY_REFERENCE_CATEGORY: 'list.property-reference-category',
  LIST_PROPERTY_REFERENCE_CATEGORY_GLOBAL:
    'list.property-reference-category.global',
  VIEW_PROPERTY_REFERENCE_CATEGORY: 'view.property-reference-category',
  VIEW_PROPERTY_REFERENCE_CATEGORY_GLOBAL:
    'view.property-reference-category.global',
  CREATE_PROPERTY_REFERENCE_CATEGORY: 'create.property-reference-category',
  CREATE_PROPERTY_REFERENCE_CATEGORY_GLOBAL:
    'create.property-reference-category.global',
  UPDATE_PROPERTY_REFERENCE_CATEGORY: 'update.property-reference-category',
  UPDATE_PROPERTY_REFERENCE_CATEGORY_GLOBAL:
    'update.property-reference-category.global',
  DELETE_PROPERTY_REFERENCE_CATEGORY: 'delete.property-reference-category',
  DELETE_PROPERTY_REFERENCE_CATEGORY_GLOBAL:
    'delete.property-reference-category.global',

  LIST_PROPERTY_OCCUPANCY: 'list.property-occupancy',
  LIST_PROPERTY_OCCUPANCY_GLOBAL: 'list.property-occupancy.global',
  VIEW_PROPERTY_OCCUPANCY: 'view.property-occupancy',
  VIEW_PROPERTY_OCCUPANCY_GLOBAL: 'view.property-occupancy.global',
  CREATE_PROPERTY_OCCUPANCY: 'create.property-occupancy',
  CREATE_PROPERTY_OCCUPANCY_GLOBAL: 'create.property-occupancy.global',
  UPDATE_PROPERTY_OCCUPANCY: 'update.property-occupancy',
  UPDATE_PROPERTY_OCCUPANCY_GLOBAL: 'update.property-occupancy.global',
  DELETE_PROPERTY_OCCUPANCY: 'delete.property-occupancy',
  DELETE_PROPERTY_OCCUPANCY_GLOBAL: 'delete.property-occupancy.global',

  LIST_CLIENT_OCCUPANT: 'list.client-occupant',
  VIEW_CLIENT_OCCUPANT: 'view.client-occupant',
  DELETE_CLIENT_OCCUPANT: 'delete.client-occupant',
  CREATE_CLIENT_OCCUPANT_BULK: 'create.client-occupant-bulk',

  LIST_STATION: 'list.station',
  VIEW_STATION: 'view.station',
  CREATE_STATION: 'create.station',
  UPDATE_STATION: 'update.station',
  DELETE_STATION: 'delete.station',
};
