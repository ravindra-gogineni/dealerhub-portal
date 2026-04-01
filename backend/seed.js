const Inventory = require('./models/Inventory');
const Lead = require('./models/Lead');
const Appointment = require('./models/Appointment');
const Part = require('./models/Part');

const inventoryData = [
  { id: 'VIN-1N4BL4BV5LC', make: 'Nissan', model: 'Altima SV', year: 2024, status: 'In Transit', expected: 'Oct 15, 2024', orderType: 'Customer' },
  { id: 'VIN-2HGFC2F59M', make: 'Honda', model: 'Civic Touring', year: 2024, status: 'At Factory', expected: 'Nov 02, 2024', orderType: 'Stock' },
  { id: 'VIN-1FTFW1E85N', make: 'Ford', model: 'F-150 Lariat 4x4', year: 2024, status: 'Delivered', expected: 'Oct 01, 2024', orderType: 'Stock' },
  { id: 'VIN-1G1YC2D44P', make: 'Chevrolet', model: 'Corvette Stingray', year: 2024, status: 'In Transit', expected: 'Oct 20, 2024', orderType: 'Customer' },
  { id: 'VIN-5UXCR6C09R', make: 'BMW', model: 'X5 xDrive40i', year: 2024, status: 'Scheduled', expected: 'Dec 05, 2024', orderType: 'Stock' },
  { id: 'VIN-4T1G11AK8U', make: 'Toyota', model: 'Camry XSE V6', year: 2024, status: 'Delivered', expected: 'Sep 28, 2024', orderType: 'Customer' },
  { id: 'VIN-WBAJB9C55L', make: 'BMW', model: '530i xDrive', year: 2024, status: 'In Transit', expected: 'Nov 10, 2024', orderType: 'Stock' },
  { id: 'VIN-3MW5R7J06P', make: 'Tesla', model: 'Model 3 Long Range', year: 2024, status: 'At Factory', expected: 'Dec 15, 2024', orderType: 'Customer' },
  { id: 'VIN-5YJ3E1EA1P', make: 'Tesla', model: 'Model Y Performance', year: 2024, status: 'Scheduled', expected: 'Jan 08, 2025', orderType: 'Stock' },
  { id: 'VIN-JN1TANT32U', make: 'Infiniti', model: 'QX60 Luxe AWD', year: 2024, status: 'Delivered', expected: 'Sep 15, 2024', orderType: 'Customer' },
];

const leadData = [
  { id: 'L-1020', name: 'Sarah Connor', vehicle: '2024 Toyota Highlander XLE', source: 'Web', status: 'New', time: '2 hours ago', followUp: 'Today 3:00 PM' },
  { id: 'L-1021', name: 'John Smith', vehicle: '2024 Ford F-150 XLT', source: 'Phone', status: 'In Progress', time: '5 hours ago', followUp: 'Tomorrow 10:00 AM' },
  { id: 'L-1022', name: 'Emily Chen', vehicle: '2024 Honda CR-V Hybrid', source: 'Autotrader', status: 'Contacted', time: '1 day ago', followUp: 'Tomorrow 2:00 PM' },
  { id: 'L-1023', name: 'Michael Johnson', vehicle: '2024 BMW 3 Series M Sport', source: 'Web', status: 'Needs Follow-up', time: '2 days ago', followUp: 'Overdue' },
  { id: 'L-1024', name: 'Amanda Davis', vehicle: '2024 Subaru Outback Limited', source: 'Walk-in', status: 'Qualified', time: '3 days ago', followUp: 'Friday 9:00 AM' },
  { id: 'L-1025', name: 'Robert Williams', vehicle: '2024 Chevrolet Tahoe RST', source: 'Phone', status: 'New', time: '4 hours ago', followUp: 'Today 5:00 PM' },
  { id: 'L-1026', name: 'Jennifer Taylor', vehicle: '2024 Tesla Model Y', source: 'Web', status: 'In Progress', time: '6 hours ago', followUp: 'Tomorrow 11:30 AM' },
  { id: 'L-1027', name: 'Carlos Rodriguez', vehicle: '2024 Toyota Tacoma TRD', source: 'Walk-in', status: 'Contacted', time: '1 day ago', followUp: 'Wednesday 1:00 PM' },
];

const appointmentData = [
  { time: '08:00 AM', customer: 'John Doe', vehicle: '2022 Ford F-150 XLT', advisor: 'Mike R.', type: 'Maintenance - 30K Service', status: 'In Bay' },
  { time: '08:30 AM', customer: 'Patricia Moore', vehicle: '2023 Honda Accord', advisor: 'Sarah J.', type: 'Brake Inspection', status: 'In Bay' },
  { time: '09:30 AM', customer: 'Alice Smith', vehicle: '2024 Toyota Camry', advisor: 'Sarah J.', type: 'Diagnostics - Check Engine', status: 'In Bay' },
  { time: '10:00 AM', customer: 'Kevin Brown', vehicle: '2021 BMW X3', advisor: 'Mike R.', type: 'Oil Change + Filter', status: 'Pending' },
  { time: '11:00 AM', customer: 'Bob Johnson', vehicle: '2021 BMW X5', advisor: 'Mike R.', type: 'Transmission Repair', status: 'Pending' },
  { time: '01:00 PM', customer: 'Emma Davis', vehicle: '2023 Subaru Outback', advisor: 'Sarah J.', type: 'Oil Change + Rotation', status: 'Pending' },
  { time: '02:30 PM', customer: 'Thomas Lee', vehicle: '2020 Nissan Rogue', advisor: 'Mike R.', type: 'A/C Diagnostic', status: 'Pending' },
  { time: '03:30 PM', customer: 'Chris Wilson', vehicle: '2019 Honda Civic', advisor: 'Mike R.', type: 'Tire Replacement x4', status: 'Pending' },
];

const partData = [
  { id: 'PT-10023', name: 'Brake Pad Set - Front (Ceramic)', oem: 'Ford', qty: 24, minQty: 10, price: '$85.00', status: 'In Stock' },
  { id: 'PT-10024', name: 'Oil Filter PF48E', oem: 'GM', qty: 112, minQty: 50, price: '$6.50', status: 'In Stock' },
  { id: 'PT-10025', name: 'Cabin Air Filter CF10285', oem: 'Toyota', qty: 5, minQty: 15, price: '$22.00', status: 'Low Stock' },
  { id: 'PT-10026', name: 'Spark Plug Iridium ILZKR7B11', oem: 'Honda', qty: 48, minQty: 20, price: '$14.00', status: 'In Stock' },
  { id: 'PT-10027', name: 'Wiper Blade 24" Beam', oem: 'Universal', qty: 8, minQty: 30, price: '$18.50', status: 'Reorder Pending' },
  { id: 'PT-10028', name: 'Serpentine Belt 6PK2100', oem: 'BMW', qty: 12, minQty: 8, price: '$42.00', status: 'In Stock' },
  { id: 'PT-10029', name: 'Transmission Fluid ATF (Qt)', oem: 'Universal', qty: 68, minQty: 40, price: '$9.75', status: 'In Stock' },
  { id: 'PT-10030', name: 'Brake Rotor - Front 320mm', oem: 'BMW', qty: 4, minQty: 6, price: '$125.00', status: 'Low Stock' },
  { id: 'PT-10031', name: 'Air Filter CA11476', oem: 'Ford', qty: 31, minQty: 15, price: '$18.00', status: 'In Stock' },
  { id: 'PT-10032', name: 'Headlight Bulb H11 LED', oem: 'Universal', qty: 3, minQty: 12, price: '$34.50', status: 'Reorder Pending' },
];

const seedDB = async () => {
  try {
    console.log('Seeding NeDB...');

    await Inventory.remove({}, { multi: true });
    await Lead.remove({}, { multi: true });
    await Appointment.remove({}, { multi: true });
    await Part.remove({}, { multi: true });

    await Inventory.insert(inventoryData.map(d => ({ ...d, createdAt: new Date() })));
    await Lead.insert(leadData.map(d => ({ ...d, createdAt: new Date() })));
    await Appointment.insert(appointmentData.map(d => ({ ...d, createdAt: new Date() })));
    await Part.insert(partData.map(d => ({ ...d, createdAt: new Date() })));

    console.log('Database Seeded Successfully (NeDB)!');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
