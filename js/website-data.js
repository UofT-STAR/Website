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
        linkedin: "https://www.linkedin.com/in/thaddeus-kobylarz-62aa232b0"
      }
    },
    {
      name: "Nika Kavianitabar",
      role: "Vice President",
      program: "Programs: Physics",
      initials: "NK",
      bio: "Hello! I am a third year physics spec and data science student. My current hobbies are obviously rocketry \
            and reading books! I am looking forward to work as hard as I could along passionate people !",
      motivation: "I learned and gained so much knowledge along the way.Utstar taught me team work, discipline, to be \
                    ambitious and most importantly to be curious.",
      contact: {
        email: "nika.kavianitabar@mail.utoronto.ca",
        linkedin: "https://www.linkedin.com/in/nika-kavianitabar-08285a2b2/"
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
        linkedin: "https://www.linkedin.com/in/andrew-miranda-69a0301ab"
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
        email: "joshuaz.chen@mail.utoronto.ca",
        linkedin: "https://www.linkedin.com/in/joshuazcchen/"
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
        email: "ty.cui@mail.utoronto.ca",
        linkedin: "https://www.linkedin.com/in/tycui/"
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
        email: "ashish.abburvenkatakumar@mail.utoronto.ca",
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
        email: "kai.bague@mail.utoronto.ca",
        linkedin: "https://www.linkedin.com/in/kai-tano-bague-30569237b/"
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
        email: "anastasia.butnariu@mail.utoronto.ca",
        linkedin: "https://www.linkedin.com/in/anastasia-butnariu-86b4a3289/"
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
        email: "zagrous.ghodsian@mail.utoronto.ca",
        linkedin: "https://www.linkedin.com/in/zagrous-ghodsian-0054372ab/"
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
        email: "jasmine.prete@mail.utoronto.ca",
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
      icon: "fa-solid fa-shuttle-space",
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

  programs: [
    {
      title: "L1 Certification Programs",
      icon: "fa-solid fa-certificate",
      description: "Our year round flagship rocketry program dedicated towards educating new rocketeers in the basics of high power rocketry and earning them their Level 1 Certification!",
      status: "In Progress",
      statusClass: "active",
      detailedDescription: "This is the premier way for new members in our club to learn, engage with, and become familiar with High Power Rocketry.\n\
        We run this program in batches of students year round. Where, over the course of a month or two, Executives lead small groups through presentations and workshops\n\
        in preparing students for their own certification launch. Students will learn the basic physical principles behind rocketry, the safety and precautions necessary,\n\
        the tools and skillset for building their own rocket, and everything else they need to build and successfully fly their first high power rocket!",
      details: [
        "Learn the skills necessary for independent rocketry",
        "Earn a certification you can be proud of",
        "Meet new people who share your love for engineering & design!",
        "Fast-track yourself to be able to have the knowhow to contribute the most to the development of team projects",
      ],
      carouselImages: [
        "Images/cert1.webp",
        "Images/cert2.webp",
        "Images/cert3.webp",
        "Images/cert4.webp",
        "Images/cert5.webp",
      ]
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
    },
    // {
    //     title: "Program Name",
    //     icon: "fas fa-graduation-cap",
    //     description: "Short description shown on the card.",

    //     status: "Active",
    //     statusClass: "active",

    //     detailedDescription:
    //         "Longer description shown when the program is opened.",

    //     details: [
    //         "First program detail",
    //         "Second program detail"
    //     ],

    //     carouselImages: [
    //         "Images/Programs/example-1.webp"
    //     ]
    // }
],

  outreachEvents: [
  // Example: copy this object for each outreach event and replace the values.
  {
    title: "Event Name",
    icon: "fas fa-users",
    description: "Short card description shown on events.html.",
    status: "Upcoming",
    statusClass: "active",
    detailedDescription: "Longer description shown when the card is opened.",
    detailsHeading: "Event Highlights & Details", // optional
    details: [
      "First detail",
      "Second detail"
    ],
    carouselImages: [
      "Images/Outreach/example-1.webp",
      "Images/Outreach/example-2.webp"
    ]
  }
],

  // Rocketry Division subteams shown on about.html.
  // Add, remove, or reorder objects here; the About-page grid adapts automatically.
  subteams: [
    {
      name: "Aerodynamics / Mechanics",
      icon: "fas fa-wind",
      description: "Our Aero/Mech team is principally concerned with the function and design of the air frames of each of \
      our rockets. They do the most hands on work of any of our sub-teams on our main project rockets and also hold the \
      responsibility alongside propulsion of accurately simulating our rocket to ensure that it deploys correctly during \
      launch."
    },
    {
      name: "Avionics",
      icon: "fas fa-microchip",
      description: "Our Avionics team handles all of the aspects of the flight computers which we launch with our rockets. \
      At the level of rocketry that our team works with, Avionics is all but required to ensure that we are able to \
      detonate black powder charges or stage our rockets successfully for recovery. This team works on both assembling \
      and testing home-built flight computers as well as commercial off the shelf ones depending on the needs of the \
      project."
    },
    {
      name: "Propulsion",
      icon: "fas fa-fire",
      description: "Our Propulsion team works on the assembly of our motor mounts as well as the selection of which \
      rocketry motors we will utilize for our projects during the design phase. The team works alongside the Aero/Mech \
      team to ensure that the rocket is able to withstand the intense forces of launch through simulations as well as \
      ensuring that the correct materials and procedures are used in the construction of the rocket."
    },
    {
      name: "Recovery",
      icon: "fas fa-parachute-box",
      description: "Our Recovery team is our newest yet still critically important sub-team. This team works primarily \
      with ensuring that our parachutes and related recovery hardware are able to handle the heat and forces of \
      deployment charges as well as making sure that our parachutes deploy properly and correctly when they need to. \
      This involves a decent amount of cooperation with our Avionics team and plenty of on the ground testing before \
      launch day to ensure that our charges, chutes, and avionics can properly work together to ensure a successful \
      recovery."
    }
  ],

  features: [
    {
      icon: "fas fa-rocket",
      title: "Rocket Development",
      description: "Design and launch high power rockets ranging from L1 certification flights to massive multi-month club wide rocketry projects."
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
      description: "We're always on the lookout for peers, graduates, or industry professionals with experience who are \
      willing to share and assist us in expanding our rocketry know how. If you're interested in helping our team \
      advance towards more complex projects head over to our Contact page to shoot us an email!",
      actionLabel: "Learn More",
      href: "contact.html"
    },
    {
      audience: "Sponsors",
      icon: "fas fa-handshake",
      description: "If you're interested in supporting us financially or materially in reaching our project goals, head \
      on over to our Contact page to see how you can reach out to us!",
      actionLabel: "Learn More",
      href: "contact.html"
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
    {
       name: "Sawyer Shaw",
       role: "Peer Mentor",
       organization: "Ascendant Research Group",
       bio: "Sawyer is a Third Year student at Rensselaer Polytechnic Institute pursuing a degree in Aerospace Engineering. He is currently the Propulsion Engineer for Ascendant Research Group in their current space-shot project and has provided our team with an amazing amount of guidance throughout the past year in climbing the ladder of High Power Rocketry.",
       image: "Images/Sawyer_shaw.webp",
       website: "https://www.linkedin.com/in/sawyer-shaw/"
     }
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
    {
       name: "Solidworks",
       level: "Club Sponsor",
       description: "",
       logo: "Images/SolidWorks_Logo.webp",
       website: "https://www.solidworks.com/"
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
