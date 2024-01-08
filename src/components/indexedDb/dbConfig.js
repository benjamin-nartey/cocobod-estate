export const ESTATE_DB_CONFIG = {
  name: "ESTATEDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "propertyReferenceCategories",
      storeConfig: { keyPath: "id" },
      storeSchema: [
        { name: "id", keyPath: "id", options: { unique: true } },
        { name: "name", keypath: "name", options: { unique: false } },
        {
          name: "propertyType",
          keypath: "propertyType",
          options: { unique: false },
        },
        { name: "district", keypath: "district", options: { unique: false } },
      ],
    },
    {
      store: "propertyReferences",
      storeConfig: { keyPath: "id" },
      storeSchema: [
        { name: "id", keyPath: "id", options: { unique: true } },
        {
          name: "locationOrTown",
          keypath: "locationOrTown",
          options: { unique: false },
        },
        { name: "lot", keypath: "lot", options: { unique: false } },
        {
          name: "marketValue",
          keypath: "marketValue",
          options: { unique: false },
        },
        {
          name: "currentUsefulLife",
          keypath: "currentUsefulLife",
          options: { unique: false },
        },
        {
          name: "description",
          keypath: "description",
          options: { unique: false },
        },
        {
          name: "descriptionPerFixedAssetReport",
          keypath: "descriptionPerFixedAssetReport",
          options: { unique: false },
        },
        {
          name: "plotSize",
          keypath: "plotSize",
          options: { unique: false },
        },
        {
          name: "floorArea",
          keypath: "floorArea",
          options: { unique: false },
        },
        {
          name: "division",
          keypath: "division",
          options: { unique: false },
        },
        {
          name: "propertyReferenceCategory",
          keypath: "propertyReferenceCategory",
          options: { unique: false },
        },
        {
          name: "region",
          keypath: "region",
          options: { unique: false },
        },
        {
          name: "propertyUnit",
          keypath: "propertyUnit",
          options: { unique: false },
        },
        {
          name: "propertType",
          keypath: "propertyType",
          options: { unique: false },
        },
      ],
    },
    {
      store: "politcalDistricts",
      storeConfig: { keyPath: "id" },
      storeSchema: [
        { name: "id", keyPath: "id", options: { unique: true } },
        {
          name: "politicalRegion",
          keypath: "politicalRegion",
          options: { unique: false },
        },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: "politcalRegions",
      storeConfig: { keyPath: "id" },
      storeSchema: [
        { name: "id", keyPath: "id", options: { unique: true } },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },
    {
      store: "districts",
      storeConfig: { keyPath: "id" },
      storeSchema: [
        { name: "id", keyPath: "id", options: { unique: true } },
        { name: "regionId", keypath: "regionId", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
        {
          name: "districtType",
          keypath: "districtType",
          options: { unique: false },
        },
      ],
    },
    {
      store: "locations",
      storeConfig: { keyPath: "id" },
      storeSchema: [
        { name: "id", keyPath: "id", options: { unique: true } },
        {
          name: "districtId",
          keyPath: "districtId",
          options: { unique: false },
        },
        { name: "name", keypath: "name", options: { unique: false } },
      ],
    },

    {
      store: "propertyTypes",
      storeConfig: { keyPath: "id" },
      storeSchema: [
        { name: "id", keyPath: "id", options: { unique: true } },
        { name: "name", keypath: "name", options: { unique: false } },
        {
          name: "attributes",
          keypath: "attributes",
          options: { unique: false },
        },
      ],
    },

    {
      store: "clientOccupants",
      storeConfig: { keyPath: "id" },
      storeSchema: [
        { name: "id", keyPath: "id", options: { unique: true } },
        { name: "name", keypath: "name", options: { unique: false } },
        {
          name: "category",
          keypath: "category",
          options: { unique: false },
        },
        {
          name: "phoneNumber",
          keypath: "phoneNumber",
          options: { unique: false },
        },
        {
          name: "email",
          keypath: "email",
          options: { unique: false },
        },
      ],
    },

    // {
    //   store: "offlineUser",
    //   storeConfig: { keyPath: "id" },
    //   storeSchema: [
    //     { name: "id", keyPath: "id", options: { unique: true } },
    //     { name: "name", keyPath: "name", options: { unique: false } },
    //     { name: "email", keyPath: "email", options: { unique: false } },
    //     { name: "roles", keyPath: "roles", options: { unique: false } },
    //     { name: "staff", keyPath: "staff", options: { unique: false } },
    //   ],
    // },

    {
      store: "property",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: false } },
        {
          name: "description",
          keypath: "description",
          options: { unique: false },
        },
        {
          name: "propertyCode",
          keyPath: "propertyCode",
          options: { unique: false },
        },
        {
          name: "digitalAddress",
          keyPath: "digitalAddress",
          options: { unique: false },
        },
        {
          name: "propertyTypeId",
          keyPath: "propertyTypeId",
          options: { unique: false },
        },
        {
          name: "locationId",
          keyPath: "locationId",
          options: { unique: false },
        },
        {
          name: "divisionId",
          keyPath: "divisionId",
          options: { unique: false },
        },
        {
          name: "propertyReferenceCategoryId",
          keyPath: "propertyReferenceCategoryId",
          options: { unique: false },
        },
        {
          name: "arcGisLink",
          keyPath: "arcGisLink",
          options: { unique: false },
        },
        {
          name: "lat",
          keyPath: "lat",
          options: { unique: false },
        },
        {
          name: "long",
          keyPath: "long",
          options: { unique: false },
        },
        {
          name: "landmark",
          keyPath: "landmark",
          options: { unique: false },
        },
        {
          name: "propertyUnits",
          keyPath: "propertyUnits",
          options: { unique: false },
        },
      ],
    },
  ],
};
