// Website data exported as JavaScript module
// This works with file:// protocol unlike JSON fetch

const websiteData = {
  // Leadership profiles.
  // Fill in bio, motivation, and whichever contact links each person wants public.
  // Empty fields are handled gracefully by the Leadership profile modal.
  teamMembers: [
    {
      name: "Thaddeus Kobylarz",
      role: "President",
      program: "Programs: Astronomy and Physics",
      initials: "TJMPK-III",
      bio: "Hi! I'm Thaddeus and I am a third year student in the Astronomy & Physics specialist program. I'm currently working on my L2 Certification project and have been doing rocketry for almost 4 years now!",
      motivation: "I think what motivates me most in this club is being able to share my love for rocketry. There is nothing that is more fulfilling than being able to introduce people to something that I love so much and seeing them fall in love with it too.",
      contact: {
        email: "thaddeus.kobylarz@mail.utoronto.ca",
        linkedin: "www.linkedin.com/in/thaddeus-kobylarz-62aa232b0"
      }
    },
    {
      name: "Nika Kavianitabar",
      role: "Vice President",
      program: "Programs: Physics",
      initials: "NK",
      bio: "",
      motivation: "",
      contact: {
        email: "",
        linkedin: ""
      }
    },
    {
      name: "Andrew Miranda",
      role: "Director of Aerodynamics and Mechanics",
      program: "Programs: Astronomy and Physics, Mathematics minor",
      initials: "AM",
      bio: "",
      motivation: "",
      contact: {
        email: "andrew.miranda@mail.utoronto.ca",
        linkedin: "www.linkedin.com/in/andrew-miranda-69a0301ab"
      }
    },
    {
      name: "Joshua Chen",
      role: "Director of Finance",
      program: "Programs: Computer Science, Management and Economics minor",
      initials: "JC",
      bio: "",
      motivation: "",
      contact: {
        email: "",
        linkedin: ""
      }
    },
    {
      name: "Tymon Cui",
      role: "Director of Avionics",
      program: "Programs: Mathematics and Computer Science",
      initials: "TC",
      bio: "",
      motivation: "",
      contact: {
        email: "",
        linkedin: ""
      }
    },
    {
      name: "Ashish Abbur Venkata Kumar",
      role: "Director of Propulsion",
      program: "Programs: Physics and Mathematics minor",
      initials: "AK",
      bio: "",
      motivation: "",
      contact: {
        email: "",
        linkedin: ""
      }
    },
    {
      name: "Kai Tano Bague",
      role: "Technical Director",
      program: "Programs: Computer Science, Data Science and Mathematics minor",
      initials: "KTB",
      bio: "",
      motivation: "",
      contact: {
        email: "",
        linkedin: ""
      }
    },
    {
      name: "Anastasia Butnariu",
      role: "Director of Outreach",
      program: "Programs: Mechanical Engineering",
      initials: "AB",
      bio: "",
      motivation: "",
      contact: {
        email: "",
        linkedin: ""
      }
    },
    {
      name: "Zagrous Ghodsian",
      role: "Executive Secretary",
      program: "Program: Physics and Mathematics minor",
      initials: "ZG",
      bio: "",
      motivation: "",
      contact: {
        email: "",
        linkedin: ""
      }
    },
    {
      name: "Jasmine Prete",
      role: "Director of Recovery",
      program: "Programs: Astronomy and Physics",
      initials: "JP",
      bio: "",
      motivation: "",
      contact: {
        email: "",
        linkedin: ""
      }
    },
  ],

  // Featured project shown on the homepage.
  // Edit this object to change the spotlight without touching index.html.
  homeProjectSpotlight: {
    status: "Active Build",
    title: "Two-Stage Launch Vehicle",
    lede: "Target altitude",
    callout: "7,500+ feet",
    technicalNote: {
      prefix: "Our team is currently working on a build for a ",
      emphasis: "two stage capable solid rocket launch platform",
      suffix: " capable of mounting two 54mm motors"
    },
    missionNote: {
      prefix: "",
      emphasis: "The end goal is to construct a launch system capable of handling the forces of supersonic flight",
      suffix: " as a demonstration of our club's ability to partake in major events including Launch Canada 2027."
    },
    specs: [
      {
        eyebrow: "Propulsion",
        value: "2 x 54 mm",
        label: "motor mounts",
        featured: true
      },
      {
        eyebrow: "Motor Configuration",
        value: "TBD",
        label: "TBD"
      },
      {
        eyebrow: "Mission",
        value: "LC 2027",
        label: "Target for a reliable platform"
      },
    ],
    actionLabel: "Explore the build",
    href: "projects.html"
  },

  projects: [
    {
      title: "Two Stage Launch Vehicle",
      icon: "fas fa-two-stager",
      description: "A high power launch vehicle mounting 2 x 54mm motors across two stages. The end goal being to ensure that both 4\" stages are dual-deploy recoverable consistently by Launch Canada 2027.",
      status: "In Progress",
      statusClass: "active",
      detailedDescription: "This project is meant to be the culmination of everything that we have worked on in rocketry so far. We are constructing\n\
        a 7\' 8\" fully composite rocket which will mount multiple flight computers in order to ensure the safe recovery of each stage of the\n\
        rocket. The main design challenge for this project will be the rigorous designing & testing of our avionics to ensure the rocket stages & recovers properly.\n\
        As we progress in the design & construction phases this page will be updated with more details on the project as well as photos of our work!",
      details: [
        "2 x 54 mm motor mount capabilities",
        "7,500+ ft projected altitude",
        "4 Flight Computers for Recovery & Redundancy",
        "Full fiberglass body capable of enduring the forces of supersonic flight",
      ],
      carouselImages: []
    },
    {
      title: "Team-Built Flight Computer Demonstration",
      icon: "fas fa-laptop-code",
      description: "A home-bult flight computer designed and built by our Avionics Team on an arduino platform. It is dual deploy capable launching on a 3\" body with a 29mm motor.",
      status: "Completed",
      statusClass: "completed",
      detailedDescription: "This was our first ever design challenge as a club. Although fairly simple in hindsight, it was a very important milestone for us.\n\
        We spent the spring designing and producing a flight computer capable of dual-deploy recovery of a 3\" diameter mid-power rocket!\n\
        This project was mostly aimed at introducing rocketry to many in our team who were just starting out. A large part of this involved \n\
        programming, software design, as well as soldering. This also was a demonstration of our newest members' abilities to construct their own hardware.",
      details: [
        "Team built Flight Computer capable of replicating the same functions as commercially sold devices",
        "Capable of deploying gunpowder charges for dual-deploy recovery purposes",
        "Wifi Capable for remote arming of charges",
        "Radio Telemetry for accurate data collection on the rocket's position and acceleration",
        "Successful demonstration of the computer's ability to execute the safe recovery of our rocket"
      ],
      carouselImages: []
    },
    {
      title: "Rocket Assembly Workshop",
      icon: "fas fa-chalkboard-teacher",
      description: "A Fun, educational, and creative workshop where our passionate club members assembled our rocket parts!",
      status: "Completed",
      statusClass: "completed",
      detailedDescription: "An engaging hands-on workshop where team members learned about rocket assembly, structural components, and the fundamentals of model rocketry.\n\
      This workshop provided practical experience in building and preparing rockets for flight.",
      details: [
        "Hands-on experience with rocket assembly techniques",
        "Understanding of structural components and their functions",
        "Team collaboration and knowledge sharing",
        "Safety protocols and best practices in rocketry",
        "Introduction to flight preparation procedures"
      ],
      carouselImages: [
        "Images/Carrousel1/1.webp",
        "Images/Carrousel1/2.webp",
        "Images/Carrousel1/3.webp",
        "Images/Carrousel1/4.webp",
        "Images/Carrousel1/5.webp",
        "Images/Carrousel1/6.webp",
        "Images/Carrousel1/7.webp",
        "Images/Carrousel1/8.webp"
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
      description: "Design and launch medium and high power rockets of various different designs and purposes."
    },
    {
      icon: "fas fa-microchip",
      title: "Avionics & Software",
      description: "Team-designed and built flight computers. With telemetry and software coded in C/C++ and Python."
    },
    {
      icon: "fas fa-cogs",
      title: "Aerodynamics, Mechanical Design, & Propulsion Systems",
      description: "Custom designed rocketry parts, motor mounts, recovery systems, and both team-designed and kit based rockets."
    }
  ],

  // Join Us cards. Add or edit options here instead of changing join-us.html.
  joinOptions: [
    {
      audience: "Students",
      icon: "fas fa-user-graduate",
      description: "UofT students can join our community through Discord and learn how to get involved with the team.",
      actionLabel: "Join Our Discord",
      href: "https://discord.gg/nNsQn5J4SU"
    },
    {
      audience: "Mentors",
      icon: "fas fa-chalkboard-teacher",
      description: "Information for prospective mentors will be added here once the mentorship process is finalized.",
      actionLabel: "Coming Soon",
      href: null
    },
    {
      audience: "Sponsors",
      icon: "fas fa-handshake",
      description: "Information for prospective sponsors will be added here once the sponsorship process is finalized.",
      actionLabel: "Coming Soon",
      href: null
    }
  ],

  // Add mentors here. Copy the example object and remove the // markers.
  mentors: [
    // {
    //   name: "Mentor Name",
    //   role: "Mentor",
    //   organization: "Organization or affiliation",
    //   bio: "Short mentor description.",
    //   image: "Images/Mentors/example.webp",
    //   website: "https://example.com"
    // }
  ],

  // Add sponsors here. Copy the example object and remove the // markers.
  sponsors: [
    // {
    //   name: "Sponsor Name",
    //   level: "Sponsor level or category",
    //   description: "Short sponsor description.",
    //   logo: "Images/Sponsors/example.webp",
    //   website: "https://example.com"
    // }
  ]
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = websiteData;
}
if (typeof window !== 'undefined') {
  window.websiteData = websiteData;
}
