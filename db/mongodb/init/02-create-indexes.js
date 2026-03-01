db = db.getSiblingDB('ananta');

db.fhir_resources.createIndex({ resourceType: 1, fhirId: 1 }, { unique: true });
db.fhir_resources.createIndex({ resourceType: 1, patientRef: 1 });
db.fhir_resources.createIndex({ 'meta.lastUpdated': -1 });

db.fhir_bundles.createIndex({ userId: 1 });
db.fhir_bundles.createIndex({ createdAt: -1 });

print('Indexes created successfully');
