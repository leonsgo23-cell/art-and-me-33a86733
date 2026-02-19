
export interface Review {
  id: number;
  name: string;
  age: string;
  text: string;
  image: string;
}

export interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
}

export interface ProgramModule {
  id: number;
  title: string;
  description: string;
  lessons: number;
}
