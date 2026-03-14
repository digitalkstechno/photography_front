import { EntityConfig } from "./entity.types";

export const USERS_ENTITY: EntityConfig = {
  key: "users",
  idKey: "_id",

  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "text", required: true },
    { name: "role", label: "Role", type: "text" }
  ],
  label: "",
  api: ""
};

export const SERVICES_ENTITY: EntityConfig = {
  key: "services",
  idKey: "_id",

  fields: [
    { name: "name", label: "Service Name", type: "text", required: true },
    { name: "price", label: "Price", type: "number" },
    { name: "description", label: "Description", type: "textarea" }
  ],
  label: "",
  api: ""
};

export const PARTY_ENTITY: EntityConfig = {
  key: "party",
  idKey: "_id",

  fields: [
    { name: "name", label: "Client Name", type: "text" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "address", label: "Address", type: "textarea" }
  ],
  label: "",
  api: ""
};

export const ENTITY_REGISTRY: Record<string, EntityConfig> = {
  users: USERS_ENTITY,
  services: SERVICES_ENTITY,
  party: PARTY_ENTITY
};
