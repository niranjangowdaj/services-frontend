import { ServiceType, Location } from './enums';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  location: Location;
  type: ServiceType;
  image: string;
  phone: string;
  features: string[];
  provider: {
    id: string;
    name: string;
    avatar: string;
  };
} 