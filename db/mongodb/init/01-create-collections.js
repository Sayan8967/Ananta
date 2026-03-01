db = db.getSiblingDB('ananta');

db.createCollection('fhir_resources', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['resourceType', 'fhirId', 'resource'],
      properties: {
        resourceType: { bsonType: 'string', description: 'FHIR resource type' },
        fhirId: { bsonType: 'string', description: 'FHIR Resource.id' },
        resource: { bsonType: 'object', description: 'Full FHIR R4 JSON' },
        meta: {
          bsonType: 'object',
          properties: {
            versionId: { bsonType: 'string' },
            lastUpdated: { bsonType: 'date' },
            source: { bsonType: 'string' },
          },
        },
        patientRef: { bsonType: 'string' },
      },
    },
  },
});

db.createCollection('fhir_bundles');

print('Collections created successfully');
