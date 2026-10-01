import { User } from '../types/microservices';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-customer-001',
    name: 'Abdel Rahman',
    email: 'abdel.rahman@example.com',
    phone: '+91 98201 54321',
    avatarUrl: '',
    role: 'customer',
    addresses: [
      {
        id: 'addr-001',
        fullName: 'Abdel Rahman',
        phoneNumber: '+91 98201 54321',
        street: 'Linking Road, Bandra West, Apt 402',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India',
        isDefault: true
      },
      {
        id: 'addr-002',
        fullName: 'Abdel Rahman',
        phoneNumber: '+91 98450 12345',
        street: '100ft Road, Indiranagar, 2nd Stage',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
        isDefault: false
      }
    ]
  },
  {
    id: 'usr-admin-002',
    name: 'Priya Sharma',
    email: 'admin@stella-apparel.com',
    phone: '+91 98110 99887',
    avatarUrl: '',
    role: 'admin',
    addresses: [
      {
        id: 'addr-admin-001',
        fullName: 'Stella Operations Hub India',
        phoneNumber: '+91 98110 99887',
        street: 'Cyber City, Tower B, Phase II',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122002',
        country: 'India',
        isDefault: true
      }
    ]
  }
];
