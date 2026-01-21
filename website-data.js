// Website data exported as JavaScript module
// This works with file:// protocol unlike JSON fetch

const websiteData = {
  teamMembers: [
    {
      name: "Thaddeus Kobylarz",
      role: "President",
      program: "Programs: Astronomy and Physics",
      initials: "TJMPK-III"
    },
    {
      name: "Zagrous Ghodsian",
      role: "Vice President",
      program: "Program: Physics and Mathematics minor",
      initials: "ZG"
    },
    {
      name: "Ashish Abbur Venkata Kumar",
      role: "Propulsion Lead",
      program: "Programs: Physics and Mathematics minor",
      initials: "AK"
    },
    {
      name: "Andrew Miranda",
      role: "Mechanical & Aerodynamics Lead",
      program: "Programs: Astronomy, Physics and Mathematics minor",
      initials: "AM"
    },
    {
      name: "Tymon Cui",
      role: "Avionics Lead",
      program: "Programs: Mathematics and Computer Science",
      initials: "TC"
    },
    {
      name: "Joshua Chen",
      role: "Finance Team Lead",
      program: "Programs: Computer Science, Management and Economics minor",
      initials: "JC"
    },
    {
      name: "Anastasia Butnariu",
      role: "Media & Outreach Team Lead",
      program: "Programs: Mechanical Engineering",
      initials: "AB"
    },
    {
      name: "Inba Thiyagarajan",
      role: "Executive Secretary",
      program: "Programs: Computer Science and Mathematics minor",
      initials: "IT"
    },
    {
      name: "Kai Tano Bague",
      role: "Lead Web Designer",
      program: "Programs: Computer Science, Data Science and Mathematics minor",
      initials: "KTB"
    },
    {
      name: "Nika Kavianitabar",
      role: "Systems Integration Lead",
      program: "Programs: Physics",
      initials: "NK"
    }
  ],
  projects: [
    {
      title: "VTOL Demonstrator",
      icon: "fas fa-rocket",
      description: "A propulsively landing rocket without a parachute - our flagship project showcasing thrust vector control, guidance, and navigation systems.",
      status: "In Progress",
      statusClass: "active",
      detailedDescription: "Our flagship project aims to demonstrate a model rocket capable of propulsive landing without the use of a parachute. This ambitious project showcases advanced thrust vector control, real-time guidance algorithms, and sophisticated navigation systems.",
      details: [
        "Thrust Vector Control (TVC) system for precise landing control",
        "Custom flight computer with real-time sensor fusion",
        "Advanced guidance algorithms for autonomous landing",
        "Telemetry system for ground station monitoring",
        "Composite airframe optimized for weight and durability",
        "High-precision IMU and GPS integration"
      ],
      carouselImages: []
    },
    {
      title: "Rocket Assembly Workshop",
      icon: "fas fa-chalkboard-teacher",
      description: "Fun, educational and creative workshop where our passionate club members assembled our rocket parts!",
      status: "Completed",
      statusClass: "completed",
      detailedDescription: "An engaging hands-on workshop where team members learned about rocket assembly, structural components, and the fundamentals of model rocketry. This workshop provided practical experience in building and preparing rockets for flight.",
      details: [
        "Hands-on experience with rocket assembly techniques",
        "Understanding of structural components and their functions",
        "Team collaboration and knowledge sharing",
        "Safety protocols and best practices in rocketry",
        "Introduction to flight preparation procedures"
      ],
      carouselImages: [
        "Carrousel1/1.jpg",
        "Carrousel1/2.jpg",
        "Carrousel1/3.jpg",
        "Carrousel1/4.jpg",
        "Carrousel1/5.jpg",
        "Carrousel1/6.jpg",
        "Carrousel1/7.jpg",
        "Carrousel1/8.jpg"
      ]
    }
    // {
    //   title: "Avionics Systems",
    //   icon: "fas fa-microchip",
    //   description: "Flight computers, telemetry, and ground control software using C/C++ and Python with simulation and Hardware-in-the-Loop testing.",
    //   status: "In Progress",
    //   statusClass: "active"
    // },
    // {
    //   title: "Structures & Propulsion",
    //   icon: "fas fa-tools",
    //   description: "Airframe design, composite structures, motor integration, thrust characterization, and recovery/VTOL hardware development.",
    //   status: "In Progress",
    //   statusClass: "active"
    // }
  ],
  features: [
    {
      icon: "fas fa-rocket",
      title: "Rocket Development",
      description: "Design and launch mid‑ to large‑scale model rockets showcasing unique technology"
    },
    {
      icon: "fas fa-microchip",
      title: "Avionics & Software",
      description: "Flight computers, telemetry, and software integration in C/C++ and Python"
    },
    {
      icon: "fas fa-cogs",
      title: "Structures & Propulsion",
      description: "Composites, thrust characterization, recovery systems, and VTOL hardware"
    }
  ]
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = websiteData;
}
if (typeof window !== 'undefined') {
  window.websiteData = websiteData;
}