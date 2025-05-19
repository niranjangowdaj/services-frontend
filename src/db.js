import { ServiceType, Location } from './types/enums';

export const services = [
  {
    id: '1',
    name: 'Professional Home Cleaning',
    description: 'Expert cleaning services for your home, including deep cleaning, sanitization, and organization.',
    price: 2500,
    rating: 4.8,
    reviews: 156,
    location: Location.MUMBAI,
    type: ServiceType.CLEANING,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    phone: '+91 98765 43210',
    features: [
      'Deep Cleaning',
      'Sanitization',
      'Window Cleaning',
      'Bathroom Cleaning',
      'Kitchen Cleaning'
    ],
    provider: {
      id: '101',
      name: 'CleanPro Services',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  },
  {
    id: '2',
    name: 'Expert Plumbing Solutions',
    description: '24/7 emergency plumbing services, pipe repairs, and installation of new fixtures.',
    price: 1800,
    rating: 4.6,
    reviews: 89,
    location: Location.DELHI,
    type: ServiceType.PLUMBING,
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    phone: '+91 98765 43211',
    features: [
      'Emergency Repairs',
      'Pipe Installation',
      'Leak Detection',
      'Water Heater Service',
      'Drain Cleaning'
    ],
    provider: {
      id: '102',
      name: 'Delhi Plumbing Experts',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    }
  },
  {
    id: '3',
    name: 'Electrical Safety & Repairs',
    description: 'Complete electrical services including repairs, installations, and safety inspections.',
    price: 1500,
    rating: 4.9,
    reviews: 234,
    location: Location.BANGALORE,
    type: ServiceType.ELECTRICAL,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    phone: '+91 98765 43212',
    features: [
      'Electrical Repairs',
      'Safety Inspections',
      'New Installations',
      'Emergency Service',
      'Wiring Upgrades'
    ],
    provider: {
      id: '103',
      name: 'Bangalore Electric Solutions',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  },
  {
    id: '4',
    name: 'Professional Painting Services',
    description: 'Interior and exterior painting services with premium quality paints and expert craftsmanship.',
    price: 12000,
    rating: 4.7,
    reviews: 178,
    location: Location.HYDERABAD,
    type: ServiceType.PAINTING,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    phone: '+91 98765 43213',
    features: [
      'Interior Painting',
      'Exterior Painting',
      'Wall Texturing',
      'Color Consultation',
      'Premium Paints'
    ],
    provider: {
      id: '104',
      name: 'Hyderabad Paint Masters',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
    }
  },
  {
    id: '5',
    name: 'Custom Carpentry Work',
    description: 'Custom furniture making, repairs, and woodwork installations by skilled craftsmen.',
    price: 3500,
    rating: 4.8,
    reviews: 92,
    location: Location.CHENNAI,
    type: ServiceType.CARPENTRY,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    phone: '+91 98765 43214',
    features: [
      'Custom Furniture',
      'Wood Repairs',
      'Installations',
      'Cabinet Making',
      'Wood Finishing'
    ],
    provider: {
      id: '105',
      name: 'Chennai Woodworks',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    }
  },
  {
    id: '6',
    name: 'Garden Maintenance & Design',
    description: 'Professional gardening services including maintenance, landscaping, and plant care.',
    price: 2000,
    rating: 4.5,
    reviews: 67,
    location: Location.KOLKATA,
    type: ServiceType.GARDENING,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    phone: '+91 98765 43215',
    features: [
      'Garden Maintenance',
      'Landscaping',
      'Plant Care',
      'Lawn Care',
      'Garden Design'
    ],
    provider: {
      id: '106',
      name: 'Kolkata Garden Care',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
    }
  },
  {
    id: '7',
    name: 'Professional Moving Services',
    description: 'Safe and efficient moving services for homes and offices with complete packing and unpacking.',
    price: 8000,
    rating: 4.7,
    reviews: 145,
    location: Location.PUNE,
    type: ServiceType.MOVING,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    phone: '+91 98765 43216',
    features: [
      'Home Moving',
      'Office Relocation',
      'Packing Service',
      'Furniture Moving',
      'Storage Solutions'
    ],
    provider: {
      id: '107',
      name: 'Pune Movers',
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
    }
  },
  {
    id: '8',
    name: 'Home Renovation Experts',
    description: 'Complete home renovation and remodeling services with expert craftsmanship.',
    price: 25000,
    rating: 4.9,
    reviews: 89,
    location: Location.AHMEDABAD,
    type: ServiceType.OTHER,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    phone: '+91 98765 43217',
    features: [
      'Home Renovation',
      'Interior Design',
      'Space Planning',
      'Material Selection',
      'Project Management'
    ],
    provider: {
      id: '108',
      name: 'Ahmedabad Renovations',
      avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
    }
  }
]; 