export type Cause = {
    id: string;
    title: string;
    organization: string;
    description: string;
    goal: number;
    raised: number;
    category: string;
    image: string;
    deadline?: Date;
    featured?: boolean;
  };
  
  export const causes: Cause[] = [
    {
      id: "1",
      title: "Clean Water for Rural Villages",
      organization: "WaterWell Foundation",
      description: "Help provide clean drinking water to 10 rural villages in East Africa, affecting over 5,000 people.",
      goal: 25000,
      raised: 18650,
      category: "Water",
      image: "https://images.unsplash.com/photo-1643521734445-11e97455aab9",
      deadline: new Date("2023-12-31"),
      featured: true,
    },
    {
      id: "2",
      title: "Education for Underprivileged Children",
      organization: "Knowledge Is Power",
      description: "Support education initiatives for 500 children in underprivileged communities.",
      goal: 15000,
      raised: 7820,
      category: "Education",
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b",
      deadline: new Date("2024-02-28"),
      featured: true,
    },
    {
      id: "3",
      title: "Wildlife Conservation Project",
      organization: "Nature Guardians",
      description: "Protect endangered species and their habitats in the Amazon rainforest.",
      goal: 50000,
      raised: 32100,
      category: "Environment",
      image: "https://images.unsplash.com/photo-1597239450996-ea7c21achiever",
      deadline: new Date("2023-11-30"),
      featured: true,
    },
    {
      id: "4",
      title: "Emergency Relief for Flood Victims",
      organization: "Disaster Relief Alliance",
      description: "Provide food, shelter, and medical aid to families affected by recent floods.",
      goal: 30000,
      raised: 28700,
      category: "Disaster Relief",
      image: "https://images.unsplash.com/photo-1620066276998-a0d266ade8b2",
    },
    {
      id: "5",
      title: "Community Health Clinic",
      organization: "Healthcare For All",
      description: "Build and equip a community health clinic to serve low-income neighborhoods.",
      goal: 75000,
      raised: 42300,
      category: "Healthcare",
      image: "https://images.unsplash.com/photo-1588774172127-2728ebd60bienyi",
    },
    {
      id: "6",
      title: "Sustainable Farming Initiative",
      organization: "Green Earth Collective",
      description: "Train farmers in sustainable agricultural practices to improve crop yields and protect the environment.",
      goal: 20000,
      raised: 12450,
      category: "Environment",
      image: "https://images.unsplash.com/photo-1625246333195-78d73a2e3c39",
    }
  ];
  