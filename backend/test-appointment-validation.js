import appointmentModel from './models/appointmentModel.js';
import mongoose from 'mongoose';

console.log('Testing appointment schema validation...');

// Get required fields
const schema = appointmentModel.schema;
const requiredFields = [];
schema.eachPath((path, schemaType) => {
  if (schemaType.isRequired) {
    requiredFields.push(path);
  }
});

console.log('Required fields:', requiredFields);

// Test with missing fields
const testData = {
  docId: 'test123',
  slotDate: '1_1_2025', 
  slotTime: '10:00 AM'
};

console.log('Testing validation with incomplete data:', testData);
const newAppointment = new appointmentModel(testData);

newAppointment.validate(err => {
  if (err) {
    console.log('Validation errors found:');
    Object.keys(err.errors).forEach(key => {
      console.log(`- ${key}: ${err.errors[key].message}`);
    });
  } else {
    console.log('Validation passed');
  }
  process.exit(0);
});