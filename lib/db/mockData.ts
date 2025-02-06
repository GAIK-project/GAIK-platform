export const haagaHeliaData = {
  educational_content: [
    {
      id: "course_001",
      title: "Introduction to Business Intelligence",
      description:
        "Learn the fundamentals of business intelligence and data analytics in modern organizations",
      credits: 5,
      campus: "Pasila",
      language: "English",
      teachers: ["Dr. Maria Anderson", "John Smith"],
      keywords: [
        "business intelligence",
        "data analytics",
        "SQL",
        "visualization",
      ],
      content_blocks: [
        {
          title: "Course Overview",
          text: "This course provides students with practical knowledge of business intelligence tools and methods. Students learn to analyze business data and create meaningful visualizations.",
        },
        {
          title: "Learning Objectives",
          text: "After completing the course, students can identify key BI concepts, use common BI tools, and create basic data visualizations for business decision making.",
        },
      ],
    },
    {
      id: "course_002",
      title: "Digital Marketing Strategies",
      description:
        "Master the essential digital marketing tools and strategies for modern business",
      credits: 5,
      campus: "Malmi",
      language: "English",
      teachers: ["Lisa Johnson", "Mike Peters"],
      keywords: [
        "digital marketing",
        "social media",
        "SEO",
        "content strategy",
      ],
      content_blocks: [
        {
          title: "Course Overview",
          text: "Students will learn to create and implement effective digital marketing strategies across various platforms and channels.",
        },
        {
          title: "Learning Objectives",
          text: "Students will be able to develop comprehensive digital marketing plans and measure their effectiveness using analytics tools.",
        },
      ],
    },
    {
      id: "course_003",
      title: "Service Design Fundamentals",
      description:
        "Explore the principles of designing user-centric services and experiences in both digital and physical environments",
      credits: 5,
      campus: "Haaga",
      language: "English",
      teachers: ["Sarah Lee", "Mark White"],
      keywords: [
        "service design",
        "user experience",
        "design thinking",
        "innovation",
      ],
      content_blocks: [
        {
          title: "Course Overview",
          text: "In this course, students will learn how to apply service design methodologies to create solutions that meet user needs and drive business innovation.",
        },
        {
          title: "Learning Objectives",
          text: "By the end of the course, students can map customer journeys, identify pain points, and prototype service design solutions.",
        },
      ],
    },
    {
      id: "course_004",
      title: "AI and Machine Learning Basics",
      description:
        "Introduction to the fundamental concepts of artificial intelligence and machine learning with real-world applications",
      credits: 5,
      campus: "Pasila",
      language: "English",
      teachers: ["Dr. Angela Brown", "Michael Chen"],
      keywords: [
        "artificial intelligence",
        "machine learning",
        "data science",
        "Python",
      ],
      content_blocks: [
        {
          title: "Course Overview",
          text: "Students will learn about AI and machine learning algorithms, tools, and practices through hands-on programming assignments and case studies.",
        },
        {
          title: "Learning Objectives",
          text: "Upon completion, students will be able to build simple machine learning models and understand how AI is applied in various industries.",
        },
      ],
    },
    // New courses
    {
      id: "course_005",
      title: "Blockchain for Business",
      description:
        "Examine the fundamentals of blockchain technology and its applications in finance, supply chain, and more",
      credits: 5,
      campus: "Malmi",
      language: "English",
      teachers: ["Dr. Eva Hill", "James Watson"],
      keywords: [
        "blockchain",
        "cryptocurrency",
        "distributed ledger",
        "fintech",
      ],
      content_blocks: [
        {
          title: "Course Overview",
          text: "Students will learn core blockchain concepts, including cryptography, consensus mechanisms, and smart contracts, with a focus on business use cases.",
        },
        {
          title: "Learning Objectives",
          text: "After completion, students can evaluate blockchain solutions, understand implementation challenges, and propose blockchain-based innovations.",
        },
      ],
    },
    {
      id: "course_006",
      title: "Graphic Design in Marketing",
      description:
        "Create compelling visual content and campaigns for various digital marketing platforms",
      credits: 5,
      campus: "Haaga",
      language: "English",
      teachers: ["Emily Carter", "Robert Moore"],
      keywords: [
        "graphic design",
        "branding",
        "visual communication",
        "photoshop",
      ],
      content_blocks: [
        {
          title: "Course Overview",
          text: "Students will explore graphic design principles and apply them to real-world marketing campaigns using industry-standard tools.",
        },
        {
          title: "Learning Objectives",
          text: "By the end of the course, students can develop consistent brand visuals, create promotional materials, and collaborate with marketing teams effectively.",
        },
      ],
    },
  ],
  campus_information: [
    {
      name: "Pasila",
      address: "Ratapihantie 13, 00520 Helsinki",
      facilities: [
        {
          type: "Library",
          description:
            "Modern library with extensive digital resources and study spaces",
          openingHours: "Mon-Fri 8:00-20:00",
        },
        {
          type: "Computer Labs",
          description: "Multiple computer laboratories with latest software",
          openingHours: "Mon-Fri 7:30-20:00",
        },
      ],
    },
    {
      name: "Malmi",
      address: "Hietakummuntie 1A, 00700 Helsinki",
      facilities: [
        {
          type: "Student Restaurant",
          description: "Modern cafeteria serving daily lunch options",
          openingHours: "Mon-Fri 10:30-14:30",
        },
        {
          type: "Group Work Spaces",
          description: "Collaborative spaces for team projects",
          openingHours: "Mon-Fri 8:00-18:00",
        },
      ],
    },
    {
      name: "Haaga",
      address: "Pajuniityntie 11, 00320 Helsinki",
      facilities: [
        {
          type: "Sports Center",
          description:
            "Gym and indoor sports hall available for students and staff",
          openingHours: "Mon-Fri 7:00-21:00, Sat 9:00-17:00",
        },
        {
          type: "Café",
          description: "Cozy café serving coffee, pastries, and quick snacks",
          openingHours: "Mon-Fri 8:00-18:00",
        },
      ],
    },
    // New campus
    {
      name: "Porvoo",
      address: "Taidetehtaankatu 1, 06100 Porvoo",
      facilities: [
        {
          type: "Media Lab",
          description:
            "Equipped with audio and video editing suites, photography studio, and green screens",
          openingHours: "Mon-Fri 8:00-18:00",
        },
        {
          type: "Student Lounge",
          description:
            "Comfortable seating and recreational area for students to relax or work in groups",
          openingHours: "Mon-Fri 9:00-19:00",
        },
      ],
    },
  ],
  degree_programs: [
    {
      name: "Business Information Technology",
      code: "BIT",
      type: "Bachelor's",
      duration: "3.5 years",
      credits: 210,
      language: "English",
      description:
        "Program focusing on combining business and IT skills for modern digital business environment",
      key_courses: [
        "Programming",
        "Database Design",
        "Business Intelligence",
        "Project Management",
      ],
    },
    {
      name: "International Business",
      code: "GLOBBA",
      type: "Bachelor's",
      duration: "3.5 years",
      credits: 210,
      language: "English",
      description: "Comprehensive business program with international focus",
      key_courses: [
        "International Marketing",
        "Global Business Strategies",
        "Financial Management",
        "Cross-Cultural Communication",
      ],
    },
    {
      name: "Hospitality Management",
      code: "HOSP",
      type: "Bachelor's",
      duration: "3.5 years",
      credits: 210,
      language: "English",
      description:
        "Learn the principles of hospitality, event management, and customer service in the hospitality industry",
      key_courses: [
        "Hotel Operations",
        "Event Management",
        "Customer Experience",
        "Food and Beverage Management",
      ],
    },
    {
      name: "Software Engineering",
      code: "SE",
      type: "Bachelor's",
      duration: "4 years",
      credits: 240,
      language: "English",
      description:
        "Focus on the full lifecycle of software development, from design to deployment",
      key_courses: [
        "Object-Oriented Programming",
        "Data Structures and Algorithms",
        "Software Architecture",
        "DevOps Practices",
      ],
    },
    // New degree programs
    {
      name: "Tourism and Event Management",
      code: "TOUREM",
      type: "Bachelor's",
      duration: "3.5 years",
      credits: 210,
      language: "English",
      description:
        "Develop skills in managing tourism services and planning large-scale events for international audiences",
      key_courses: [
        "Destination Management",
        "Event Planning and Execution",
        "Tourism Marketing",
        "Sustainable Tourism",
      ],
    },
    {
      name: "Finance and Accounting",
      code: "FNA",
      type: "Bachelor's",
      duration: "3.5 years",
      credits: 210,
      language: "English",
      description:
        "Learn essential financial management and accounting principles to support businesses and organizations",
      key_courses: [
        "Financial Reporting",
        "Corporate Finance",
        "Management Accounting",
        "Auditing and Assurance",
      ],
    },
  ],
  student_services: [
    {
      service: "Student Affairs Office",
      location: "Pasila Campus, 1st floor",
      contact: "studentaffairs@haaga-helia.fi",
      opening_hours: "Mon-Fri 10:00-14:00",
      services: [
        "Student certificates",
        "Study rights",
        "Graduation process support",
        "General guidance",
      ],
    },
    {
      service: "IT Helpdesk",
      location: "All campuses",
      contact: "helpdesk@haaga-helia.fi",
      opening_hours: "Mon-Fri 8:00-16:00",
      services: [
        "Technical support",
        "Account management",
        "Software assistance",
        "Equipment loans",
      ],
    },
    {
      service: "Career Services",
      location: "Malmi Campus, 2nd floor",
      contact: "careerservices@haaga-helia.fi",
      opening_hours: "Mon-Fri 9:00-15:00",
      services: [
        "Internship guidance",
        "CV and LinkedIn review",
        "Job search workshops",
        "Career counseling",
      ],
    },
    {
      service: "Student Wellbeing Center",
      location: "Haaga Campus, A-wing",
      contact: "wellbeing@haaga-helia.fi",
      opening_hours: "Mon-Fri 9:00-16:00",
      services: [
        "Mental health counseling",
        "Stress management sessions",
        "Peer support groups",
        "Referral to healthcare services",
      ],
    },
    // New student services
    {
      service: "International Exchange Office",
      location: "Pasila Campus, 3rd floor",
      contact: "exchange@haaga-helia.fi",
      opening_hours: "Mon-Fri 10:00-14:00",
      services: [
        "Exchange program guidance",
        "Erasmus+ coordination",
        "Visa application support",
        "Partner university contacts",
      ],
    },
    {
      service: "Student Union Office",
      location: "Porvoo Campus, lobby",
      contact: "studentunion@haaga-helia.fi",
      opening_hours: "Mon-Fri 10:00-16:00",
      services: [
        "Student club registrations",
        "Event planning",
        "Membership services",
        "Discount card distribution",
      ],
    },
  ],
};
