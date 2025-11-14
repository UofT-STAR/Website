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
      statusClass: "active"
    },
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