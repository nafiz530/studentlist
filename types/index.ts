export interface Member {
  id: string;
  name: string;
  class: '8' | '9' | '10';
  section: 'A' | 'B' | 'C';
  roll: string;
  status: 'Booked' | 'Pre-register' | 'Full paid' | 'Custom Paid';
  customAmount?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  members: Member[];
}
